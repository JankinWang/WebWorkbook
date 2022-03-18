class LazyManClass {
  constructor(name) {
    console.log('Hi I am ', name)
    this.taskList = []

    setTimeout(() => {
      this.next()
    })
  }

  eat(name) {
    const that = this
    let fn = ((n) => {
      return () => {
        console.log('I am eating ' + n)
        that.next()
      }
    })(name)

    this.taskList.push(fn)
    return this
  }

  sleep(time) {
    const that = this
    let fn = ((t) => {
      return () => {
        setTimeout(() => {
          console.log(`等待了 ${t} 秒`)
          that.next()
        }, t * 1000)
      }
    })(time)

    this.taskList.push(fn)
    return this
  }

  eat2(name) {
    const that = this

    let fn = () => {
      console.log('I am eating ' + name)
      that.next()
    }

    this.taskList.push(fn)
    return this
  }

  sleepFirst(time) {
    const that = this
    let fn = ((t) => {
      return () => {
        setTimeout(() => {
          console.log(`等待了 ${t} 秒`)
          that.next()
        }, t * 1000)
      }
    })(time)

    this.taskList.unshift(fn)

    return this
  }

  next() {
    let fn = this.taskList.shift()
    if (typeof fn === 'function') {
      fn()
    }
  }
}

function LazyMan(name) {
  return new LazyManClass(name)
}

LazyMan('Hank').eat('饺子').sleep(2).eat2('水果')

'1997-9-10 10:5'.replace(/(?<=[-:])(\d)/g, () => {})
