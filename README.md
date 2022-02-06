# s-carousel

A high-performance seamless scrolling plugin, implemented with `requestAnimationFrame` and `translate` .


## Installation

```
npm i s-carousel
# or
pnpm add s-carousel
# or
yarn add s-carousel
```


## Quick Start

The DOM structure of the page needs to be set according to the following conventions


``` html
<!-- container -->
<div id="box">
  <!-- list -->
  <ul>
    <!-- items -->
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
  </ul>
  <!-- DOM elements like "dot indicator" or "forward and back arrows" can be added here-->
</div>
```


Initialize a simple "seamless scroll" instance:

``` js
import SCarousel from 's-carousel';

const carousel = new SCarousel({
  el: 'box',
  direction: 'left',
  width: 375,
  height: 175,
  autoPlay: false
});


const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', function() {
  carousel.start();
});
```


## Props

| Prop name        | Describe                                                                                                   | Optional value                        | Defaults | Required |
| ------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------- | ------ | ---- |
| `el`          | container element. Can be an already obtained `DOM` object, or an element `id`                                             | `DOMElement` or `String`      | -     | Yes   |
| `direction`   | direction of scrolling                                                                                             | `left`, `right`, `up`, `down` | `left` | No   |
| `width`       | The width of the container, in `px`                                                                                  | `Number`                      | -     | Yes   |
| `height`      | The height of the container, in `px`                                                                                  | `Number`                      | -     | Yes   |
| `delay`       | The time to stay on each screen, in `ms`                                                                              | `Number`                      | `3000` | No   |
| `duration`    | The time it takes to scroll one screen, in `ms`                                                                          | `Number`                      | `300`  | No   |
| `activeIndex` | The index of the element displayed by default in the list, starting from `0`                                                             | `Number`                      | `0`    | No   |
| `autoPlay`    | Whether to automatically start playback, if set to `false`, you can call the instance's `start` method to start manually later                          | `Boolean`                     | `true` | No   |
| `prevent`     | Prevent page scrolling, usually used for vertical playback. When set to `true`, it can avoid the page scrolling up and down caused by the user's swipe gesture in the component | `Boolean`                     | `true` | No   |
| `onChange`    | The callback function when switching between screens, the input parameter is the index of the current screen, which can be used for scenarios such as customizing the small dot indicator                     | `Function`                    | -     | No   |



## Instance Method

#### `start`

When non-autoplay, call this method to start playback manually. Can only be called once, only if `autoPlay` is `false` and never started.


#### `stop`

Stop play.


#### `continue`

Resume playback. Used with the `stop` method.



#### `go`

Scroll directly to the position of an index, or scroll one screen in a certain direction. You can use this method to quickly jump or switch back and forth in business scenarios. 

- Example: `carousel.go(0)` or `carousel.go('left')`
- Argument type: `Number` or `left`, `right`, `up`, `down`



#### `resize`

Update the width or height of the container.

- Example: `carousel.resize(375, 175) // width, height`
- Parameter type: `Number`, unit `px`

For example, the following code resets the width and height of the container after monitoring the browser window size change.


``` js
(function(vm) {
  var resizing,
    resizeTimer,
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  vm.resizeHandler = function() {
    if (!resizing) {
      resizing = true;
      carousel.stop();
    }
    resizeTimer && clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizing = false;
      carousel.resize(document.body.clientWidth, 300);
      requestAnimationFrame(function() {
        carousel.continue();
      });
    }, 100);
  };
  window.addEventListener('resize', vm.resizeHandler);
})(this); 
```

Don't forget to clear the listener when leaving the page! The following is an example of clearing the window change listener in the `beforeDestroy` hook of `Vue`

```js
beforeDestroy(){
  window.removeEventListener('resize', this.resizeHandler);
}
```

#### `destroy`

Destroy the instance, restoring the element's default style

Here is an example of calling this method in React's `componentWillUnmount` hook:

```js
componentWillUnmount(){
  this.carousel.destroy()
}
```

## Reference

1. [seamless-scroll](https://github.com/haochuan9421/seamless-scroll)
