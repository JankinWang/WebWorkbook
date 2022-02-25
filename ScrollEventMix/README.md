# ScrollEventMix

用于给一个元素（如：scrollParent）的 scroll 事件扩展特殊类型的事件处理机制。

## 方法

### addHandler(type, handler [, immediately])

#### 功能：添加事件处理器

#### 参数

- type 事件类型

  - view: 用于判断指定元素是否在 scrollParent 的可视区内，参数是 isView 方法
  - scroll: 与正常的 scroll 事件一样，参数是 event 事件对象

- handler 事件处理函数

  当 scrollParent 的 scroll 事件被触发时，会根据 type 回调此函数。每种类型的回调参数不同。

- immediately 是否立即触发， 默认 false。设置为 true 则会立即调用一次。

#### 用法

```html
<div id="scrollParent">
  <div style="margin-top: 100px;">
    <div class="subDiv hidden"></div>
    <div class="subDiv hidden"></div>
    <div class="subDiv hidden"></div>
    <div class="subDiv hidden"></div>
    <div class="subDiv hidden"></div>
    <div class="subDiv hidden"></div>
  </div>
</div>
```

当 subDiv 进入 scrollParent 显示区域，则删除 hidden 类名，反之则添加 hidden。

```js
let scrollParent = document.querySelector('#scrollParent');
let subDiv = document.querySelectorAll('.subDiv');

const sh = new ScrollEventMix(scrollParent);

sh.addHandler(
  'view',
  function subDivShow(isView) {
    subDiv.forEach((item, index) => {
      if (isView(item)) {
        item.classList.remove('hidden');
      }
    });
  },
  true
);
```

### isView(element [, config = {}])

> 判断传入的 element 是否处在 scrollParent 的可视区域

参数

- element， scrollParent 中的元素

- config ， 配置对象

  ```js
  const {
    // 延迟触发的距离
    // 当元素进入可视区 x 后才算进入
    delay = 0,

    // 框定显示区域中的部分区域，作为最终的显示区域
    // 相对于 scrollTop 和 scrollBottom
    range = {
      top: 0,
      bottom: 0,
    },
  } = config;
  ```

返回值 {Boolean}

用法

```js
let scrollParent = document.querySelector('#scrollParent');
let subDiv = document.querySelectorAll('.subDiv');

const sh = new ScrollEventMix(scrollParent);
sh.isView(subDiv); // 返回值 Boolean
```
