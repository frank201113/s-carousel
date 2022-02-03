import { SCarouselProps } from "./carousel-type";

/**
 * 设置父容器样式
 * @param wrap HTMLElement
 * @param opts SCarouselProps
 */
export function setContainerStyle(wrap: HTMLElement, opts: SCarouselProps) {
  wrap.style.display = 'block';
  wrap.style.width = opts.width + 'px';
  wrap.style.height = opts.height + 'px';
  wrap.style.overflow = 'hidden';
}

/**
 * 设置列表样式
 * @param list HTMLElement
 * @param opts SCarouselProps
 * @param isHorizontal boolean
 */
export function setListStyle(list: HTMLElement, opts: SCarouselProps, isHorizontal: boolean) {
  list.style.display = 'block';
  list.style.zIndex = '10';
  if (isHorizontal) {
    list.style.height = opts.height + 'px';
    list.style.width = opts.width * (length + 2) + 'px';
  } else {
    list.style.height = opts.height * (length + 2) + 'px';
    list.style.width = opts.width + 'px';
  }
}

/**
 * 设置元素样式
 * @param items HTMLCollection
 * @param opts SCarouselProps
 * @param isHorizontal boolean
 */
export function setItemsStyle(items: HTMLCollection, opts: SCarouselProps, isHorizontal: boolean) {
  for (let i = 0; i < length; i++) {
    const item = items[i] as HTMLElement;
    item.style.display = 'block';
    item.style.width = opts.width + 'px';
    item.style.height = opts.height + 'px';
    if (isHorizontal) {
      item.style.float = 'left';
    }
  }
}

/**
 * 前后各补充一个边界元素，以实现“无缝”的视觉效果
 * @param items HTMLCollection
 * @param list HTMLElement
 */
export function cloneBoundary(items: HTMLCollection, list: HTMLElement) {
  const firstItem = items[0].cloneNode(true);
  const lastItem = items[length - 1].cloneNode(true);
  // https://www.runoob.com/jsref/met-node-insertbefore.html
  list.insertBefore(lastItem, items[0]);
  list.appendChild(firstItem);
}

/**
 * 获取当前屏的索引
 * 当用户用手指快速滑动时，或者通过 go 方法指定式的操作跳转时
 * 用户潜意识里通常会认为占据屏幕大部分面积的那一屏是当前屏
 * @param offset 列表元素当前的位置偏移量 (通过读取元素的样式也可以获取，但这样通过 JS 变量来记录，对性能的开销显然小于直接操作 DOM）
 * @param eleSize 单个元素在移动方向上的尺寸
 * @returns number
 */
export function getVisualIndex(offset: number, eleSize: number) {
  let index = Math.round(Math.abs(offset) / eleSize);
  if (index === 0) {
    // 补位到最前面的那一屏
    index = length;
  } else if (index === length + 1) {
    // 补位到最后面的那一屏
    index = 1;
  }
  return --index;
}

/**
 * 清除添加的样式
 * @param wrap 容器 dom
 * @param list 列表 dom
 * @param items 元素 dom
 * @param isHorizontal 是否水平方向运动
 */
export function clearStyle(
  wrap: HTMLElement,
  list: HTMLElement,
  items: HTMLCollection,
  isHorizontal: boolean
) {
  // 1. 父容器样式
  wrap.style.display = '';
  wrap.style.width = '';
  wrap.style.height = '';
  wrap.style.overflow = '';

  // 2. 列表样式
  list.style.display = '';
  list.style.height = '';
  list.style.width = '';
  list.style.transform = '';

  // 3. 移除边界元素
  list.removeChild(items[0]);
  list.removeChild(items[length]);

  // 4. 元素样式
  for (let i = 0; i < length; i++) {
    const item = items[i] as HTMLElement;
    item.style.display = '';
    item.style.width = '';
    item.style.height = '';
    if (isHorizontal) {
      item.style.float = '';
    }
  }
}
