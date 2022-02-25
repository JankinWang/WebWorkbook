function partial(fn, ...args) {
  return (...arg) => {
    return fn(...args, ...arg)
  }
}
