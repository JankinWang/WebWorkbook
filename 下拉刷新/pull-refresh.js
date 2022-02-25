function pullRefresh(el) {
  this.el = el;
  this.scrollEl = this.getScroller(el.parentElemet); // el 的首个有滚动条的父级
  this.status = 'normal';
  this.startY = 0;
  this.ceiling = false;

  this.pullDistance = 80;
  this.headHeight = 50;

  // 事件
  // 触发加载 ，状态是loosing时触发
  this.onRefresh = () => {};

  // 下拉过程中持续触发
  // this.onPulling = (distance, status) => {};

  // 松开每次松开时触发，无论状态是不是loosing
  this.onLoosing = () => {
  };

  // 方法
  // 加载完成
  this.refreshed = () => {
    this.setStatus(0)
    this.resetPull();
  };



  // 拖动事件处理器, 可自行修改
  // 按下
  this.onTouchstart = (event) => {
    this.checkPullStart(event);
  };

  // 拖动
  this.onTouchmove = (event) => {
    if (!this.ceiling) {
      this.checkPullStart(event);
    }

    const screenY = event.touches[0].clientY;
    let distance = screenY - this.startY;

    if (this.ceiling && distance >= 0) {
      event.preventDefault();
      this.distance = this.ease(distance);
      this.setStatus(this.distance)
    }
  };

  // 结束
  this.onTouchend = (event) => {
    if (this.status === 'loosing') {
      this.setStatus(+this.headHeight, true)
      this.onRefresh(event);
    } else {
      this.setStatus(0)
    }

    this.onLoosing()
  };

  this.listenerEvent();
}

// 监听事件
pullRefresh.prototype.listenerEvent = function () {

  this.el.addEventListener("touchstart", this.onTouchstart);

  this.el.addEventListener("touchmove", this.onTouchmove);

  this.el.addEventListener("touchend", this.onTouchend);
};

// 移除事件
pullRefresh.prototype.removeEvent = function () {
  this.el.removeEventListener("touchstart", this.onTouchstart);

  this.el.removeEventListener("touchmove", this.onTouchmove);

  this.el.removeEventListener("touchend", this.onTouchend);
};

// 设置状态
pullRefresh.prototype.setStatus = function (distance, isLoading) {
  let status;
  if (isLoading) {
    status = "loading";
  } else if (distance === 0) {
    status = "normal";
  } else {
    status =
      distance < (this.pullDistance || this.headHeight) ? "pulling" : "loosing";

      this.onPulling(distance, status)
  }

  this.el.style.transform = `translateY(${distance}px)`;

  if (status !== this.status) {
    this.status = status;
  }
};

// 曲线
pullRefresh.prototype.ease = function (distance) {
  const pullDistance = +(this.pullDistance || this.headHeight);

  if (distance > pullDistance) {
    if (distance < pullDistance * 2) {
      distance = pullDistance + (distance - pullDistance) / 2;
    } else {
      distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
    }
  }

  return Math.round(distance);
};

pullRefresh.prototype.checkPullStart = function (event) {
  this.ceiling = this.getScrollTop(this.scrollEl) === 0;

  if (this.ceiling) {
    this.startY = event.touches[0].clientY;
  }
};

pullRefresh.prototype.resetPull = function () {
  this.loading = false;
  this.startY = 0;
  this.ceiling = false;
};

pullRefresh.prototype.getScrollTop = function (el) {
  const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
};

pullRefresh.prototype.getScroller = function (el, root = window) {
  let node = el;

  while (
    node &&
    node.tagName !== "HTML" &&
    node.tagName !== "BODY" &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (/scroll|auto/i.test(overflowY)) {
      return node;
    }
    node = node.parentNode;
  }

  return root;
};
