export default class TimingMap {
  constructor(canvas) {
    if (!canvas.getContext) {
      console.log('不支持canvas！');
    }

    this.cxt2d = canvas.getContext('2d');

    // 加载图片，并将图片绘制到画布上
    this.img = new Image();
    this.img.onload = () => {
      this._init();
    };
    this.img.src = './asset/ease.png';

    // 画布大小
    this.width = 700;
    this.height = 500;

    // 行列数
    this.rowNum = 5;
    this.columnNum = 6;

    // 格子大小
    this.gridWidth = Math.round(this.width / 6);
    this.gridHeight = Math.round(this.height / 5);

    // 用来保存自定义事件的处理函数
    this.events = new Map();

    // 监听画布点击
    canvas.addEventListener('click', (event) => {
      this.onClick(event);
    });

    // 设置缓动函数名称与其在图中位置的双向映射
    const tmp = this.timingMap;
    const keys = [...tmp.keys()];
    for (let key of keys) {
      this.timingMap.set(tmp.get(key).join(), key);
    }
  }

  _init() {
    this.cxt2d.drawImage(this.img, 4, 4, 700, 500);
  }

  // 重绘
  redraw() {
    // 清空画布
    this.cxt2d.clearRect(0, 0, 708, 508);
    this._init();
  }

  // 根据输入的行列，在对应位置绘制格子
  grid(row, column) {
    this.redraw();

    this.cxt2d.strokeStyle = '#ff0000';
    this.cxt2d.lineWidth = 1;
    this.cxt2d.lineJoin = 'round';

    const x = (column - 1) * this.gridWidth + 4;
    const y = (row - 1) * this.gridHeight + 4;
    const width = this.gridWidth;
    const height = this.gridHeight;

    this.cxt2d.strokeRect(x, y, width, height);
  }

  // 接收画布点击事件回调
  onClick(event) {
    const x = event.offsetX,
      y = event.offsetY;
    const cloumn = Math.ceil(x / this.gridWidth),
      row = Math.ceil(y / this.gridHeight);
    this.grid(row, cloumn);

    this.emit('click', this.timingMap.get([row, cloumn].join()));
  }

  // 根据缓动函数名称框选对应位置
  checked(timingName) {
    if (this.timingMap.has(timingName)) {
      const gird = this.timingMap.get(timingName);
      this.grid(...gird);
    }
  }

  // 注册自定义事件, 目前有: click
  on(event, func) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    // 添加事件监听
    const handlers = this.events.get(event);
    handlers.add(func);
  }

  // 触发自定义事件
  emit(event, value) {
    if (this.events.has(event)) {
      // Set 集合
      const handlers = this.events.get(event);

      // 触发事件监听器
      handlers.forEach((handler) => {
        handler.call(this, value);
      });
    }
  }

  // 缓动函数名称与其所处行列位置的映射表
  timingMap = new Map([
    ['easeInSine', [1, 1]],
    ['easeOutSine', [1, 2]],
    ['easeInOutSine', [1, 3]],
    ['easeInQuad', [1, 4]],
    ['easeOutQuad', [1, 5]],
    ['easeInOutQuad', [1, 6]],

    ['easeInCubic', [2, 1]],
    ['easeOutCubic', [2, 2]],
    ['easeInOutCubic', [2, 3]],
    ['easeInQuart', [2, 4]],
    ['easeOutQuart', [2, 5]],
    ['easeInOutQuart', [2, 6]],

    ['easeInQuint', [3, 1]],
    ['easeOutQuint', [3, 2]],
    ['easeInOutQuint', [3, 3]],
    ['easeInExpo', [3, 4]],
    ['easeOutExpo', [3, 5]],
    ['easeInOutExpo', [3, 6]],

    ['easeInCirc', [4, 1]],
    ['easeOutCirc', [4, 2]],
    ['easeInOutCirc', [4, 3]],
    ['easeInBack', [4, 4]],
    ['easeOutBack', [4, 5]],
    ['easeInOutBack', [4, 6]],

    ['easeInElastic', [5, 1]],
    ['elastic', [5, 2]],
    ['easeInOutElastic', [5, 3]],
    ['easeInBounce', [5, 4]],
    ['bounce', [5, 5]],
    ['easeInOutBounce', [5, 6]],
  ]);
}
