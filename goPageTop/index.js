// 动画执行函数
const myRaf = function getRequestAnimationFrame() {
  if (window.requestAnimationFrame) {
    return requestAnimationFrame;
  }

  return (func) => {
    setTimeout(func, 0);
  };
}()


// 缓动函数
function easeInOutQuint(pos){
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
  return 0.5 * (Math.pow((pos-2),5) + 2);
}

function easeInOutQuart(pos){
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
  return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
}
  

/**
 * 回到顶部
 *
 * @param {element} [scrollElement=null]
 * @param {number} [step=500]
 */
 function goTop(scrollElement = null, step = 500) {
  let scrollEl = scrollElement;

  if (scrollEl === null) {
    scrollEl = document.documentElement || document.body;
  }

  const startTop = scrollEl.scrollTop;
  function scrollSlow() {
    const top = scrollEl.scrollTop;
    const newStep = Math.ceil(easeInOutQuart((1.5-top/startTop))*step)
    console.log(newStep)
    if (top > 0) {
      scrollEl.scrollTop = top - newStep;
      myRaf(scrollSlow);
    }
  }

  myRaf(scrollSlow)
}

