const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 模仿 MyPromise 手写
class iPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDING
  value = null
  reason = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value

      while (this.onFulfilledCallbacks.length > 0) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason

      while (this.onRejectedCallbacks.length > 0) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    const realOnRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const promise2 = new iPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === FULFILLED) {
        fulfilledMicrotask()
      } else if (this.status === REJECTED) {
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    })

    return promise2
  }

  catch(onRejected) {
    this.then(undefined, onRejected)
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(
      new TypeError('The promise and the return value are the same')
    )
  }

  if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }

    let then
    try {
      then = x.then
    } catch (error) {
      return reject(error)
    }

    // 如果 then 是函数, 则认为x是一个iPromise实例
    if (typeof then === 'function') {
      let called = false

      try {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
            // resolve(y)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        if (called) return
        reject(error)
      }
    } else {
      // 如果 then 不是函数, 说明是一个普通对象
      resolve(x)
    }
  } else {
    // 如果 x 不为对象或者函数, 原始数据
    resolve(x)
  }
}

iPromise.deferred = function () {
  var result = {}
  result.promise = new iPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

module.exports = iPromise
