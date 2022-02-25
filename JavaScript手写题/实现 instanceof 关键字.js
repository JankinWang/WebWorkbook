/**
 * instanceof 就是判断构造函数的 prototype 属性是否出现在实例的原型链上。
 */
function instanceOf(left, right) {
  let proto = left.__proto__
  while (true) {
    if (proto === null) return false
    if (proto === right.prototype) {
      return true
    }
    proto = proto.__proto__
  }
}
