import './styles/index.less'
import SCarousel from './s-carousel';

const carousel = new SCarousel({
  el: 'box', // 容器元素的 ID
  direction: 'left', // 方向（可选值：left, right, up, down）
  width: document.body.clientWidth, // 宽度（px）
  height: (document.body.clientWidth * 175) / 375, // 高度（px）
  delay: 1500, // 每屏停留的时长
  duration: 800, // 每屏切换的动画时长
  activeIndex: 0, // 默认激活的 item 索引，从 0 开始
  autoPlay: true, // 自动播放
  prevent: true, // 阻止父元素滚动
  onChange(index) {
    const dots = document.querySelectorAll('.dot') as NodeListOf<HTMLElement>;
    dots.forEach(dot => (dot.style.color = '#333'));
    const dotDom = document.querySelector(`.dot${index}`) as HTMLElement;
    dotDom.style.color = 'red';
  }
});


// 按钮
document.getElementById('start')?.addEventListener('click', carousel.start);
document.getElementById('stop')?.addEventListener('click', carousel.stop);
document.getElementById('continue')?.addEventListener('click', carousel.continue);
document.getElementById('destroy')?.addEventListener('click', () => {
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
    resizeTimer = setTimeout(() => {
      console.log('停下来了，可以继续播放了');
      resizing = false;
      carousel.resize(document.body.clientWidth, 300);
      carousel.continue();
    }, 100);
  };
})();

// 跳转
document.getElementById('left')?.addEventListener('click', function () {
  carousel.go('left');
});
document.getElementById('right')?.addEventListener('click', function () {
  carousel.go('right');
});
document.getElementById('up')?.addEventListener('click', function () {
  carousel.go('up');
});
document.getElementById('down')?.addEventListener('click', function () {
  carousel.go('down');
});

document.querySelector('.dot0')?.addEventListener('click', function () {
  carousel.go(0);
});
document.querySelector('.dot1')?.addEventListener('click', function () {
  carousel.go(1);
});
document.querySelector('.dot2')?.addEventListener('click', function () {
  carousel.go(2);
});
document.querySelector('.dot3')?.addEventListener('click', function () {
  carousel.go(3);
});
document.querySelector('.dot4')?.addEventListener('click', function () {
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
