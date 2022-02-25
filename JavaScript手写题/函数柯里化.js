function curry(fn) {
  let judge = (...args) => {
    if (args.length === fn.length) return fn(...args)
    return (...arg) => judge(...args, ...arg)
  }

  return judge
}

// 测试
function fnc(a, b, c) {
  return a + b + c
}

let curryFnc = curry(fnc)

console.log(curryFnc(1)(2)(3))
