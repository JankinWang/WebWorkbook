/**
 * @link https://juejin.cn/post/6983904373508145189 【参考文章】
 */
// 根据pid,将此数据转为Tree结构
let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
]

// 递归方式
function toTree(arr, pid = 0) {
  let res = []

  for (let i = 0, length = arr.length; i < length; i++) {
    let item = arr[i]
    if (item.pid === pid) {
      let children = toTree(arr, item.id)
      res.push(Object.assign({ children }, item))
    }
  }

  return res
}

// 利用对象引用，两次循环
function toTreeByMap(arr) {
  let res = []
  let itemMap = {}
  for (let item of arr) {
    itemMap[item.id] = { ...item, children: [] }
  }

  for (let item of arr) {
    let id = item.id
    let pid = item.pid

    let treeItem = itemMap[id]

    if (pid === 0) {
      res.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        // 父级不存在
        itemMap[pid] = {
          children: [],
        }
      }

      itemMap[pid].children.push(treeItem)
    }
  }

  return res
}

// 利用对象引用，两次循环【最佳】
function toTreeByMap2(arr) {
  let res = []
  let itemMap = {}

  for (let item of arr) {
    let id = item.id
    let pid = item.pid

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id].children,
    }

    let treeItem = itemMap[id]
    if (pid === 0) {
      res.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }

      itemMap[pid].children.push(treeItem)
    }
  }

  return res
}

console.log(toTreeByMap2(arr))
