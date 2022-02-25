function objectFactory() {
  var obj = new Object()
  Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  var ret = Constructor.apply(obj, arguments)

  // ret || obj 这里这么写考虑了构造函数显示返回 null 的情况
  return typeof ret === 'object' ? ret || obj : obj
}

/**
 * 创建一个新的空对象
 * 将新对象的原型（__proto__）指向构造函数的 prototype 对象
 * 以新对象为 this 执行构造函数
 * 最后如果构造函数有返回值且不为null则返回这个值，否则返回新对象
 */
