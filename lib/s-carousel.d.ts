import { SCarouselProps } from "./carousel-type";
declare class SCarousel {
    start: () => void;
    stop: () => void;
    continue: () => void;
    go: (target: number | string) => void;
    resize: (width: number, height: number) => void;
    destroy: () => void;
    constructor(opts: SCarouselProps);
}
export default SCarousel;
