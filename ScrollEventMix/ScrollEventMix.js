/**
 * 为一个元素的滚动事件添加特色功能
 *
 * @class ScrollEventMix
 * @param [Element] scrollParent 有滚动条的父级元素
 */
export default class ScrollEventMix {
  constructor(scrollParent) {
    // 任务队列
    this._TaskList = []
    this.scrollParent = scrollParent

    // 父级元素的必须设置 position css 属性
    let position = getComputedStyle(scrollParent).position
    if (!['absolute', 'relative', 'fixed'].includes(position)) {
      scrollParent.style.position = 'relative'
    }

    this._setViewport()

    // 监听 scrollParent 滚动事件
    scrollParent.addEventListener('scroll', (e) => {
      requestAnimationFrame(() => {
        this._onScroll(e)
      })
    })
  }

  /**
   * 添加处理函数
   * @method
   * @param {string} type 处理类型 可选项：view、scroll
   * @param {function} handler 用于事件触发的回调函数
   * @param {boolean} immediately 立即执行
   * @memberof ScrollEventMix
   */
  addEventListener(type, handler, immediately = false) {
    // 任务
    const task = {
      type,
      handler,
    }

    // 注册处理函数
    this._TaskList.push(task)

    // 立即触发一次
    if (immediately) this._triggerHandler(task)
  }

  /**
   * 检测指定元素是否在显示区内
   *
   * @param {element} currentEl 检测元素
   * @param {object} [config={}] 配置选项
   * @param {number} [config.delay = 0] 延迟触发的距离
   * @param {number} [config.range = {top:0, bottom:0}] 设置父元素的可视范围，一般用于缩小可视范围
   * @return {boolean}
   * @memberof ScrollEventMix
   */
  isView(currentEl, config = {}) {
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
    } = config

    let { scrollTop, scrollBottom } = this
    let { offsetTop: elTop, offsetHeight: elHeight } = currentEl
    let elBottom = elTop + elHeight

    // 设置可视区域
    if (range && range.top && range.bottom) {
      scrollTop += range.top || 0
      scrollBottom -= range.bottom || 0
    }

    return elTop + delay < scrollBottom && elBottom - delay > scrollTop
  }

  // 每次滚动时触发
  _onScroll(e) {
    this._setViewport()
    this._triggerHandlerAll(e)
  }

  // 设置视口上下边界,
  // 即当前视口显示区域的顶部和底部位置, 子元素的位置在其中间则判断为出现在了视口中
  _setViewport() {
    let { scrollTop, clientHeight } = this.scrollParent

    this.scrollBottom = scrollTop + clientHeight
    this.scrollTop = scrollTop
  }

  // 触发所有任务
  _triggerHandlerAll() {
    this._TaskList.forEach((handler) => {
      this._triggerHandler(handler)
    })
  }

  // 触发指定任务
  _triggerHandler({ type, handler }, e = null) {
    switch (type) {
      case 'view':
        handler(this.isView.bind(this))
        break

      case 'scroll':
        handler(e)
        break

      default:
        break
    }
  }
}
