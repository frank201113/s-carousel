declare global {
    interface Window {
        mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        mozCancelAnimationFrame: (handle: number) => void;
    }
}
export declare type CarouselDirection = 'left' | 'right' | 'up' | 'down';
export declare type PagePos = 'pageX' | 'pageY';
export declare type Translate = 'translateX' | 'translateY';
export interface IndexObserver {
    _innerActive: number;
    innerActive?: number;
}
export interface Step {
    condition: boolean;
    action: () => void;
}
export interface SCarouselProps {
    /**
     * 容器元素。可以是已经获取到的
     * DOM 对象，也可以是元素 id
     */
    el: HTMLElement | string;
    /**
     * 容器的宽度，单位 px
     */
    width: number;
    /**
     * 容器的高度，单位 px
     */
    height: number;
    /**
     * 轮播方向
     */
    direction?: CarouselDirection;
    /**
     * 滚动一屏需要的时间，单位 ms
     */
    duration?: number;
    /**
     * 每屏停留的时间，单位 ms
     */
    delay?: number;
    /**
     * 默认显示的元素在列表中的索引，从 0 开始
     */
    activeIndex?: number;
    /**
     * 是否自动开始播放，如果设置为 false，
     * 稍后可以调用实例的 start 方法手动开始
     */
    autoPlay?: boolean;
    /**
     * 阻止页面滚动，通常用于竖向播放
     * 的情况，设置为 true 时，可避免
     * 用户在组件内的滑动手势导致的页
     * 面上下滚动
     */
    prevent?: boolean;
    /**
     * 屏与屏之间切换时的回调函数，入
     * 参为当前屏的索引，可用于自定义
     * 小圆点指示器这样的场景
     */
    onChange?: (val: number) => void;
}
export interface SCarouselInstance {
    /**
     * 非自动播放时，调用此方法可手动开始播放。只能调用一次，
     * 仅限于 autoPlay 为 false 且从未开始的情况下使用。
     */
    start: () => void;
    /**
     * 停止播放
     */
    stop: () => void;
    /**
     * 继续播放。配合 stop 方法使用。
     */
    continue: () => void;
    /**
     * 直接滚动的某个索引的位置，或者向某个方向滚动一屏。
     */
    go: (target: number | string) => void;
    /**
     * 更新容器的宽高。
     */
    resize: (width: number, height: number) => void;
    /**
     * 销毁实例，恢复元素的默认样式
     */
    destroy: () => void;
    /**
     * 用于后续拓展
     */
    [prop: string]: any;
}
