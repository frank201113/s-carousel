export function getRaf() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    if (!requestAnimationFrame) {
        throw new Error('s-carousel can\'t work, because of requestAnimationFrame is not supported in your browser!');
    }
    return requestAnimationFrame;
}
export var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
