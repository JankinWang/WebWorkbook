var _ = require('lodash')
let data = {
  array: [1, 2, 3, 4],
}

function shallowCopy(obj) {
  if (typeof obj !== 'object') return

  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

!(function () {
  // 简单版深拷贝：只考虑普通对象属性，不考虑内置对象和函数。
  function deepClone(obj) {
    if (typeof obj !== 'object') return
    var newObj = obj instanceof Array ? [] : {}
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] =
          typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
      }
    }
    return newObj
  }
})()

// -------------------------------------------------------

/**
 * 复杂版深克隆：基于简单版的基础上，
 * 还考虑了内置对象比如 Date、RegExp 等对象和函数
 * 以及解决了循环引用的问题。
 *
 * 缺点:
 * 循环引用的元素，在克隆后的新对象中指向的是原对象，
 * 这样一来，克隆对象并不是完全克隆，
 * 其元素可能还保留着对原对象或属性的引用
 */
!(function () {
  let data = {
    thisData: 'this',
    name: 'Tom',
  }

  data.thisData = data

  const isObject = (target) =>
    (typeof target === 'object' || typeof target === 'function') &&
    target !== null

  function deepClone(target, map = new WeakMap()) {
    if (map.get(target)) {
      return target
    }
    // 获取当前值的构造函数：获取它的类型
    let constructor = target.constructor
    // 检测当前对象target是否与正则、日期格式对象匹配
    if (/^(RegExp|Date)$/i.test(constructor.name)) {
      // 创建一个新的特殊对象(正则类/日期类)的实例
      return new constructor(target)
    }
    if (isObject(target)) {
      map.set(target, true) // 为循环引用的对象做标记
      const cloneTarget = Array.isArray(target) ? [] : {}
      for (let prop in target) {
        if (target.hasOwnProperty(prop)) {
          cloneTarget[prop] = deepClone(target[prop], map)
        }
      }
      return cloneTarget
    } else {
      return target
    }
  }

  let backData = deepClone(data)
  backData.thisData.name = 'Jone'
  console.log(data)
})()

// ----------------------------------------------------------

!(function () {
  // lodash 的深拷贝更靠谱
  let data = {
    thisData: 'this',
    name: 'Tom',
  }
  data.thisData = data

  let backData = _.cloneDeep(data)
  backData.thisData.name = 'Jone'
  console.log('lodash', data)
})()
