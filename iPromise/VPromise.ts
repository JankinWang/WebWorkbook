interface onFun {
  (value: any): void
}

class VPromise {
  private state: string = 'Pending'

  constructor(fn: Function) {
    const resolve: Function = (value: any) => {
      if (this.state === 'Pending') {
        this.state = 'Fulfilled'
        this.onFulfilled(value)
      }
    }

    const reject: Function = (err: any) => {
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

  onFulfilled: onFun = (value: any): void => {}
  onRejected: onFun = (err: any): void => {}

  then(onFulfilled: onFun, onRejected?: onFun) {
    return new VPromise((resolve: Function, reject: Function) => {
      // 完成时
      this.onFulfilled = (...arg) => {
        try {
          const result: any = onFulfilled(...arg)
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

  catch(onRejected: onFun) {
    // 返回新的 Promise
    return new VPromise((resolve: Function, reject: Function) => {
      this.onRejected = (...arg) => {
        try {
          const result: any = onRejected(...arg)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  deferred() {
    var result = {
      promise: new VPromise(function (resolve, reject) {
        result.resolve = resolve
        result.reject = reject
      }),
      resolve: null,
      reject: null,
    }

    return result
  }
}

export default VPromise
