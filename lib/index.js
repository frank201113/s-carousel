var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
import './styles/index.less';
import SCarousel from './s-carousel';
var carousel = new SCarousel({
    el: 'box',
    direction: 'left',
    width: document.body.clientWidth,
    height: (document.body.clientWidth * 175) / 375,
    delay: 1500,
    duration: 800,
    activeIndex: 0,
    autoPlay: true,
    prevent: true,
    onChange: function (index) {
        var dots = document.querySelectorAll('.dot');
        dots.forEach(function (dot) { return (dot.style.color = '#333'); });
        var dotDom = document.querySelector(".dot".concat(index));
        dotDom.style.color = 'red';
    }
});
// 按钮
(_a = document.getElementById('start')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', carousel.start);
(_b = document.getElementById('stop')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', carousel.stop);
(_c = document.getElementById('continue')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', carousel.continue);
(_d = document.getElementById('destroy')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
    carousel.destroy();
    console.log(carousel);
});
// 监听窗口变化
(function () {
    var resizing, resizeTimer;
    window.onresize = function () {
        if (!resizing) {
            resizing = true;
            console.log('停止播放');
            carousel.stop();
        }
        resizeTimer && clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            console.log('停下来了，可以继续播放了');
            resizing = false;
            carousel.resize(document.body.clientWidth, 300);
            carousel.continue();
        }, 100);
    };
})();
// 跳转
(_e = document.getElementById('left')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
    carousel.go('left');
});
(_f = document.getElementById('right')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
    carousel.go('right');
});
(_g = document.getElementById('up')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () {
    carousel.go('up');
});
(_h = document.getElementById('down')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', function () {
    carousel.go('down');
});
(_j = document.querySelector('.dot0')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', function () {
    carousel.go(0);
});
(_k = document.querySelector('.dot1')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', function () {
    carousel.go(1);
});
(_l = document.querySelector('.dot2')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', function () {
    carousel.go(2);
});
(_m = document.querySelector('.dot3')) === null || _m === void 0 ? void 0 : _m.addEventListener('click', function () {
    carousel.go(3);
});
(_o = document.querySelector('.dot4')) === null || _o === void 0 ? void 0 : _o.addEventListener('click', function () {
    carousel.go(4);
});
// 禁用 Safari 的双击缩放
if (/iphone/i.test(navigator.userAgent)) {
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 360) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    });
}
