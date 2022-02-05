import {
  IndexObserver,
  SCarouselProps,
  Step,
} from "./carousel-type";

import {
  checkOpts,
  clearStyle,
  cloneBoundary,
  getVisualIndex,
  isNonNegativeNumber,
  setContainerStyle,
  setItemsStyle,
  setListStyle
} from "./utils";

import { cancelAnimationFrame, getRaf } from './raf';


const requestAnimationFrame = getRaf();

// translate 兼容到：IOS9+, Safari9.1+, Android5+, IE10+。虽然使用定位 + left/top，也可以实现本插件的效果，但是效果不如 translate
if ('transition' in document.body.style === false) {
  console.log('s-carousel may not work, because of css transition is support in your browser!');
}

class SCarousel {
  start: () => void;
  stop: () => void;
  continue: () => void;
  go: (target: number | string) => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
  constructor(opts: SCarouselProps) {
    const _this = this;
    checkOpts(opts);
    const wrap = typeof opts.el === 'object' ? opts.el : document.getElementById(opts.el); // 父容器

    if (!wrap) {
      throw new TypeError('el is an illegal dom element');
    }
    const list = wrap.children[0] as HTMLElement; // 列表
    const items = list.children; // 子元素
    const length = items.length; // 子元素数量 

    // 初始化内部变量
    const isHorizontal = opts.direction === 'left' || opts.direction === 'right'; // 是否是水平方向移动
    const pagePos = isHorizontal ? 'pageX' : 'pageY';
    const translate = isHorizontal ? 'translateX' : 'translateY';

    // 屏与屏切换时的延迟定时器
    let delayTimer: number;
    // requestAnimationFrame 的返回值
    let moveRequestId: number;
    // 列表元素当前的位置偏移量 (通过读取元素的样式也可以获取，但这样通过 JS 变量来记录，对性能的开销显然小于直接操作 DOM）
    let offset: number;
    // 列表元素需要移动到的目标位置
    let destination: number;
    // 触摸开始时的X或Y轴坐标 代替startX/startY
    let startPos: number;
    // 触摸开始时的偏移量 代替startLeft/startTop
    let startOffset: number;
    // 触摸开始时的时间戳
    let startTime: number;
    // 触摸开始时，触摸的元素的索引值
    let startIndex: number;
    // 是否已被停止
    let stopped: boolean;
    // 单个元素在移动方向上的尺寸
    let eleSize = isHorizontal ? opts.width : opts.height;
    // 每一小步移动的距离（requestAnimationFrame 的回调函数执行次数通常是每秒60次）
    let oneStep = ((eleSize / (opts.duration || 300)) * 1000) / 60;
    // 监听内部索引值的变化，并在被更改时调用 opts.onChange 方法通知外部
    let observerObj: IndexObserver = { _innerActive: (opts.activeIndex || 0) + 1 };// 内部索引
    Object.defineProperty(observerObj, 'innerActive', {
      configurable: false,
      enumerable: true,
      get() {
        return observerObj._innerActive;
      },
      set(value) {
        observerObj._innerActive = value;
        value > 0 && value < length + 1 && opts.onChange && opts.onChange(value - 1);
      }
    });

    setContainerStyle(wrap, opts)
    setListStyle(list, opts, isHorizontal, length)
    setItemsStyle(items, opts, isHorizontal, length)
    cloneBoundary(items, list, length)

    // 开始
    opts.autoPlay ? play() : resetStatus()


    /**
     * 重置状态
     */
    function resetStatus() {
      // 如果到达临界状态，更新内部索引，以达到“无缝”的效果
      let activeIndex = observerObj.innerActive || 0;
      if (activeIndex > length) {
        activeIndex = 1;
      } else if (activeIndex < 1) {
        activeIndex = length;
      }
      observerObj.innerActive = activeIndex;
      // 偏移量立即回归到准确的位置
      offset = -eleSize * activeIndex;
      list.style.transform = `${translate}(${offset}px)`;
    }

    /**
     * 播放时，每移动一屏，调一次 play 方法，以重置状态和确认新的目标位置
     */
    function play(delay = opts.delay) {
      // 重置状态
      resetStatus();
      // 停留一段时间后，确认新的目标位置，并开始下一波的移动
      delayTimer = window.setTimeout(function () {
        const direction = opts.direction as string;
        let innerActive = observerObj.innerActive as number;
        if (['left', 'up'].includes(direction)) {
          innerActive++;
        } else {
          innerActive--;
        }
        observerObj.innerActive = innerActive;
        destination = -eleSize * innerActive;
        move(direction, oneStep);
      }, delay);
    }


    function leftUpMove(step: number, moveStep: () => void) {
      offset -= step;
      if (offset > destination) {
        // 即使向前走一步也不会超出目标，那就走呗
        list.style.transform = `${translate}(${offset}px)`;
        moveRequestId = requestAnimationFrame(moveStep);
      } else {
        // 到达或超过了目标位置后，如果已经播放过了，那就可以调用 play 方法继续了，如果从来没播放过，调整好位置，静静的待着
        delayTimer ? play() : resetStatus();
      }
    }


    function rightDownMove(step: number, moveStep: () => void) {
      offset += step;
      if (offset < destination) {
        list.style.transform = `${translate}(${offset}px)`;
        moveRequestId = requestAnimationFrame(moveStep);
      } else {
        delayTimer ? play() : resetStatus();
      }
    }


    /**
     * 调用 requestAnimationFrame，一小步一小步的移动，直到到达目标位置
     * @param direction 目标位置
     * @param step 一小步的距离，步子越大，速度越快
     */
    function move(direction: string, step: number) {
      function moveStep() {
        // 由于 cancelAnimationFrame 的兼容性比较差，stop 方法触发时并不一定能让这个递归动作取消，也就是移动停止
        // 所以需要通过配合 stopped 字段来决定行止
        if (stopped) {
          return;
        }
        const moveDirection = {
          left: leftUpMove,
          up: leftUpMove,
          right: rightDownMove,
          down: rightDownMove
        }
        const runMove = moveDirection[direction]
        runMove(step, moveStep)
      }
      moveRequestId = requestAnimationFrame(moveStep);
    }

    function leftUpBestMove(min: number, step: number, moveStep: () => void) {
      const steps = [
        {
          condition: offset < destination && offset - step > min,
          action: () => {
            // 一直移动到负边界
            offset -= step;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: offset - step <= min,
          action: () => {
            // 临界状态，重置
            offset = -eleSize;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: offset - step > destination,
          action: () => {
            // 继续向目标位置移动
            offset -= step;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: true,
          action: () => {
            delayTimer ? play() : resetStatus();
          }
        }
      ];

      const item = steps.find(step => step.condition) as Step;
      item.action();
    }


    function rightDownBestMove(max: number, step: number, moveStep: () => void) {
      const steps = [
        {
          condition: offset > destination && offset + step < max,
          action: () => {
            offset += step;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: offset + step >= max,
          action: () => {
            offset = -eleSize * length;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: offset + step < destination,
          action: () => {
            offset += step;
            list.style.transform = `${translate}(${offset}px)`;
            moveRequestId = requestAnimationFrame(moveStep);
          }
        },
        {
          condition: true,
          action: () => {
            delayTimer ? play() : resetStatus();
          }
        }
      ];
      const item = steps.find(step => step.condition) as Step;
      item.action();
    }


    /**
     * 调用 requestAnimationFrame，一小步一小步的移动，分两段走，以达到“最短距离”的视觉效果
     * @param direction 方向
     * @param step 一小步的距离，步子越大，速度越快
     */
    function bestMove(direction: string, step: number) {
      let max = 0; // 偏移量的正边界
      let min = -(length + 1) * eleSize; // 偏移量的负边界
      function moveStep() {
        if (stopped) {
          return;
        }
        if (['left', 'up'].includes(direction)) {
          leftUpBestMove(min, step, moveStep)
        } else {
          rightDownBestMove(max, step, moveStep)
        }
      }

      moveRequestId = requestAnimationFrame(moveStep);
    }

    // 触摸开始
    function touchStartHandler(event: TouchEvent) {
      _this.stop();
      startTime = Date.now();
      startPos = event.touches[0][pagePos];
      startOffset = offset;
      startIndex = getVisualIndex(offset, eleSize, length);
    }
    wrap.addEventListener('touchstart', touchStartHandler);

    // 滑动
    function touchMoveHandler(event) {
      // 防止父级滚动
      opts.prevent && event.preventDefault();
      const diff = event.touches[0][pagePos] - startPos;
      // 不能超出边界位置
      const max = 0;
      const min = -eleSize * (length + 1);
      offset = Math.min(max, Math.max(min, startOffset + diff));
      list.style.transform = `${translate}(${offset}px)`;
    }
    wrap.addEventListener('touchmove', touchMoveHandler);


    // 触摸结束
    function touchEndHandler(event) {
      const moveTime = Date.now() - startTime;
      const endPos = event.changedTouches[0][pagePos];
      const speed = (endPos - startPos) / moveTime;
      if (speed < -0.6) {
        // 向左快速滑
        _this.go(startIndex === length - 1 ? 0 : startIndex + 1);
      } else if (speed > 0.6) {
        // 向右快速滑
        _this.go(startIndex === 0 ? length - 1 : startIndex - 1);
      } else {
        // 慢慢的滑，停下来后，贴到最近的那一边
        observerObj.innerActive = Math.round(Math.abs(offset) / eleSize);
        destination = -eleSize * observerObj.innerActive;
        // 开始下一波移动
        stopped = false;
        if (isHorizontal) {
          move(offset < destination ? 'right' : 'left', Math.abs(destination - offset) / 15);
        } else {
          move(offset < destination ? 'down' : 'up', Math.abs(destination - offset) / 15);
        }
      }
    }
    wrap.addEventListener('touchend', touchEndHandler);

    // 开始（该方法只能调用一次，用于非自动播放时，手动开始播放）
    this.start = function () {
      if (delayTimer) {
        // setTimeout 的返回值是正整数，一旦 play 方法被调用，该值即为 Truthy
        return;
      }
      stopped = false;
      play(0); // 0ms 延迟，立即开始移动      
    }

    // 暂停
    this.stop = function () {
      stopped = true;
      delayTimer && clearTimeout(delayTimer);
      moveRequestId && cancelAnimationFrame && cancelAnimationFrame(moveRequestId);
    }

    // 继续
    this.continue = function () {
      // 只允许在“播放过”且“被停止”的状态下调用
      if (delayTimer && stopped) {
        stopped = false;
        move(opts.direction as string, oneStep);
      }
    }
    // 以最短的距离从当前位置移动到目标屏
    this.go = function (target: number | string) {
      if (typeof target !== 'number' && ['left', 'right', 'up', 'down'].indexOf(target) === -1) {
        throw new Error('only support index or one of ["left", "right", "up", "down"]');
      }

      // 想跳转的索引
      let index;
      if (typeof target === 'number') {
        index = target;
      } else if ((isHorizontal && ['left', 'right'].indexOf(target) === -1) || (!isHorizontal && ['up', 'down'].indexOf(target) === -1)) {
        // 方向冲突
        throw new Error('direction conflict');
      } else {
        index = getVisualIndex(offset, eleSize, length);
        if (target === 'left' || target === 'up') {
          index = index === length - 1 ? 0 : index + 1;
        } else {
          index = index === 0 ? length - 1 : index - 1;
        }
      }
      // 使得 innerActive 不落在两侧的补位屏上
      observerObj.innerActive = Math.max(Math.min(index + 1, length), 1);

      // 停止原本的活动状态
      _this.stop();

      // 到下一帧再开始新的动作，这么做的原因在于：
      // cancelAnimationFrame 的兼容性并不好，stop 方法的执行并不能保证原本 move/bestMove 方法中 requestAnimationFrame 动作已经取消
      // 等一帧，让 stopped 字段先发挥作用

      requestAnimationFrame(function () {
        // 此时之前的 move/bestMove 动作已经结束，重置 stopped 为 false，以开始新的动作
        stopped = false;
        let len = eleSize * length;
        // 如果此时出现了补位屏，立即重置位置
        if (offset > -eleSize) {
          offset -= len;
        } else if (offset < -len) {
          offset += len;
        }
        list.style.transform = `${translate}(${offset}px)`;
        // 确认目标位置，并以最短的距离直接从当前位置移动到目标屏（比如从第五屏到第二屏，如果按照 5，4，3，2 的顺序走，是不如5，1，2 的顺序的）
        destination = -eleSize * (observerObj.innerActive as number);
        let diff = Math.abs(destination - offset);

        if (isHorizontal) {
          if (diff <= len / 2) {
            move(offset < destination ? 'right' : 'left', diff / 20);
          } else {
            bestMove(offset < destination ? 'left' : 'right', (len - diff) / 20);
          }
        } else {
          if (diff <= len / 2) {
            move(offset < destination ? 'down' : 'up', diff / 20);
          } else {
            bestMove(offset < destination ? 'up' : 'down', (len - diff) / 20);
          }
        }
      });
    };


    function resizeVertical(width: number, height: number) {
      // 保存之前的高
      let heightBak = opts.height;
      list.style.height = height * (length + 2) + 'px';
      list.style.width = width + 'px';
      // 满屏状态下的边界情况处理
      if (offset % heightBak === 0) {
        if (destination === 0) {
          destination = -heightBak * length; // 最后一屏
        } else if (destination === -heightBak * (length + 1)) {
          destination = -heightBak; // 第一屏
        }
      }
      // 等比缩放偏移量和目标位置的值
      destination = destination * (height / heightBak);
      offset = offset * (height / heightBak);
      list.style.transform = `${translate}(${offset}px)`;
    }

    function resizeHorizontal(width: number, height: number) {
      // 保存之前的宽
      let widthBak = opts.width;
      list.style.height = height + 'px';
      list.style.width = width * (length + 2) + 'px';
      // 满屏状态下的边界情况处理
      if (offset % widthBak === 0) {
        if (destination === 0) {
          destination = -widthBak * length; // 最后一屏
        } else if (destination === -widthBak * (length + 1)) {
          destination = -widthBak; // 第一屏
        }
      }
      // 等比缩放偏移量和目标位置的值
      destination = destination * (width / widthBak);
      offset = offset * (width / widthBak);
      list.style.transform = `${translate}(${offset}px)`;
    }

    // 重置宽高
    this.resize = function (width: number, height: number) {
      isNonNegativeNumber('width', width);
      isNonNegativeNumber('height', height);
      // 更新内部数据
      opts.width = width;
      opts.height = height;
      eleSize = isHorizontal ? width : height;
      const duration = opts.duration as number;
      oneStep = (((isHorizontal ? width : height) / duration) * 1000) / 60;
      // 更新样式
      wrap.style.width = width + 'px';
      wrap.style.height = height + 'px';
      isHorizontal ? resizeHorizontal(width, height) : resizeVertical(width, height);

      for (let i = 0; i < length + 2; i++) {
        const item = items[i] as HTMLElement;
        item.style.width = width + 'px';
        item.style.height = height + 'px';
      }
    }

    // 销毁
    this.destroy = function () {
      // 停止移动
      _this.stop();
      // 移除监听器
      wrap.removeEventListener('touchstart', touchStartHandler);
      wrap.removeEventListener('touchmove', touchMoveHandler);
      wrap.removeEventListener('touchend', touchEndHandler);
      clearStyle(wrap, list, items, isHorizontal);

      // 销毁实例
      for (let key in _this) {
        delete _this[key];
      }
      _this['__proto__'] = null;
    }

  }
}

export default SCarousel;
