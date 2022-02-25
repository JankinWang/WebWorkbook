import easeFunction from "./ease-function/easeFunction.js";

// 自定义动画函数
export default function animate({ timing, draw, duration }) {
  
  let start = performance.now();

  timing = easeFunction[timing];
  
  requestAnimationFrame(function animate(time) {
    // timeFraction 从 0 增加到 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // 计算当前动画状态
    let progress = timing(timeFraction);

    draw(progress); // 绘制

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}