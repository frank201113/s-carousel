export declare function getRaf(): ((callback: FrameRequestCallback) => number) & typeof globalThis.requestAnimationFrame;
export declare const cancelAnimationFrame: ((handle: number) => void) & typeof globalThis.cancelAnimationFrame;
