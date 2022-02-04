import { SCarouselProps } from "./carousel-type";
/**
 * 设置父容器样式
 * @param wrap HTMLElement
 * @param opts SCarouselProps
 */
export declare function setContainerStyle(wrap: HTMLElement, opts: SCarouselProps): void;
/**
 * 设置列表样式
 * @param list HTMLElement
 * @param opts SCarouselProps
 * @param isHorizontal boolean
 * @param length number
 */
export declare function setListStyle(list: HTMLElement, opts: SCarouselProps, isHorizontal: boolean, length: number): void;
/**
 * 设置元素样式
 * @param items HTMLCollection
 * @param opts SCarouselProps
 * @param isHorizontal boolean
 * @param length number
 */
export declare function setItemsStyle(items: HTMLCollection, opts: SCarouselProps, isHorizontal: boolean, length: number): void;
/**
 * 前后各补充一个边界元素，以实现“无缝”的视觉效果
 * @param items HTMLCollection
 * @param list HTMLElement
 * @param length 子元素数量
 */
export declare function cloneBoundary(items: HTMLCollection, list: HTMLElement, length: number): void;
/**
 * 获取当前屏的索引
 * @param offset 列表元素当前的位置偏移量 (通过读取元素的样式也可以获取，但这样通过 JS 变量来记录，对性能的开销显然小于直接操作 DOM）
 * @param eleSize 单个元素在移动方向上的尺寸
 * @param length 列表长度
 * @returns number
 */
export declare function getVisualIndex(offset: number, eleSize: number, length: number): number;
/**
 * 清除添加的样式
 * @param wrap 容器 dom
 * @param list 列表 dom
 * @param items 元素 dom
 * @param isHorizontal 是否水平方向运动
 */
export declare function clearStyle(wrap: HTMLElement, list: HTMLElement, items: HTMLCollection, isHorizontal: boolean): void;
/**
 * 判断是否是非负数
 * @param {Sting} field 字段名
 * @param {*} value 值
 */
export declare function isNonNegativeNumber(field: any, value: any): void;
/**
 * 判断是否是布尔值
 * @param {Sting} field 字段名
 * @param {*} value 值
 */
export declare function isBoolean(field: any, value: any): void;
/**
 * 为配置参数设置默认值并检测是否符合要求
 * @param opts SCarouselProps
 */
export declare function checkOpts(opts: SCarouselProps): void;
