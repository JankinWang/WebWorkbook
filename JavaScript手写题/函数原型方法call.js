Function.prototype.call2 = function (context, ...args) {
  context = context || window || globalThis
  context.fn = this

  let result = context.fn(...args)

  Reflect.deleteProperty(context, 'fn')

  return result
}

let numberArray = [1, 2, 3]
let stringArray = ['a', 'b', 'c']
numberArray.forEach.call2(stringArray, (item, idx, array) => {
  console.log(item)
})

// 其他实现

Function.prototype.call2 = function (context) {
  var context = context || window
  context.fn = this

  var args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }

  var result = eval('context.fn(' + args + ')')

  delete context.fn
  return result
}
