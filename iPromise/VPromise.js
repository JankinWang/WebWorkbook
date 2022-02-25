class VPromise {
  state = 'Pending'

  constructor(fn) {
    const resolve = (value) => {
      if (this.state === 'Pending') {
        this.state = 'Fulfilled'
        this.onFulfilled(value)
      }
    }

    const reject = (err) => {
      if (this.state === 'Pending') {
        this.state = 'Rejected'
        this.onRejected(err)
      }
    }

    try {
      fn(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  onFulfilled = (value) => {}
  onRejected = (err) => {}

  then(onFulfilled, onRejected) {
    return new VPromise((resolve, reject) => {
      // 完成时
      this.onFulfilled = (...arg) => {
        try {
          const result = onFulfilled(...arg)
          if (result instanceof VPromise) {
            result.then((value) => {
              resolve(value)
            })
          } else {
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }

      // 被拒绝时
      if (onRejected) {
        this.catch(onRejected)
          .then((value) => {
            resolve(value)
          })
          .catch((err) => {
            reject(err)
          })
      } else {
        this.onRejected = (err) => {
          reject(err)
        }
      }
    })
  }

  catch(onRejected) {
    // 返回新的 Promise
    return new VPromise((resolve, reject) => {
      this.onRejected = (...arg) => {
        try {
          const result = onRejected(...arg)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      }
    })
  }
}

// 测试用
VPromise.deferred = function () {
  var result = {}
  result.promise = new VPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

module.exports = VPromise
