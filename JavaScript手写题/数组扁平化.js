let data = [
  1,
  2,
  3,
  4,
  ['1', '2', '4', ['一', '二', '三', '四', ['a', 'b', 'c', 'd']]],
  ['a', 'b', 'c', 'd', ['一', '二', '三', '四', ['a', 'b', 'c', 'd']]],
]

// ES5 递归实现
function flatten(arr) {
  var result = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]))
    } else {
      result.push(arr[i])
    }
  }
  return result
}

console.log(flatten(data))

// ES6 flat 方法
let res = data.flat(4) // 4是要展开的深度, 可设置 Infinity 实现不限制深度
console.log(res)
