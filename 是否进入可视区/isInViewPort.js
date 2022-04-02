function isInViewPortOfOne(scrollParent, el) {
  let viewPortHeight = null
  let viewPortWidth = null

  // 获取当前滚动视窗的宽高
  if (scrollParent instanceof HTMLElement) {
    viewPortHeight = scrollParent.clientHeight
    viewPortWidth = scrollParent.clientWidth
  } else {
    // viewPortHeight 兼容所有浏览器写法
    viewPortHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    viewPortWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
  }

  // 判断元素 el 是否进入, scrollParent 的可视区域
  if (el.getBoundingClientRect) {
    const { top, left } = (clientRect = el.getBoundingClientRect())

    return top >= 0 && left >= 0 && top <= viewPortHeight
  } else if (window.IntersectionObserver) {
    // TODO IntersectionObserver
  } else {
    const offsetTop = el.offsetTop
    const scrollTop = scrollParent.scrollTop
    const top = offsetTop - scrollTop

    return top <= viewPortHeight
  }
}

// 查找第一个具有滚动条的父元素
function selectScrollParent(el) {
  if (el === document.documentElement) {
    return el
  }

  let parent = el.parentElement
  let maxDeep = 999 // 最大深度 防止循环次数过多
  while (maxDeep > 0) {
    const { overflowY, overflowX } = getComputedStyle(parent)
    const scrollable = overflowY || overflowX
    const topElement =
      parent === document.body || parent === document.documentElement

    if (scrollable || topElement) {
      return parent
    }

    maxDeep--
    parent = parent.parentElement
  }

  return parent
}
