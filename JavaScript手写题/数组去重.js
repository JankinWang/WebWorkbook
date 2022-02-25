let arr = [1, 2, '1', 3, 4, 5, 5, '5', 6, 7, 'a', 'b', 'a']

// 数组去重
// 利用Set的特性实现
function uniqueBySet(array) {
  return [...new Set(array)]
}

// 使用 includes 作为判断依据
function uniqueByInclueds(array) {
  let res = array.filter((item, index, array) => {
    return !array.includes(value, i + 1)
  })

  return res
}

// 使用 indexOf 作为判断依据
function unique(arr) {
  var res = arr.filter(function (item, index, array) {
    return array.indexOf(item) === index
  })
  return res
}
