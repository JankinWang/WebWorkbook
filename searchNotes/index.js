const HistoryList = [
  '你好, 我是Tom',
  '床前明月光',
  '疑是地上霜',
  '举头望明月',
  '低头思故乡',
  '前明月低头',
  '你好, 我是Bob',
  '床前明月光，我是Tom 疑是地上霜。我是Tom,床前明',
]
const sh = new SearchHistory(HistoryList)

let inputEl = document.querySelector('#input')
inputEl.addEventListener('change', (event) => {
  let keyword = event.target.value
  output(sh.filterHistory(keyword))
})

// 输出到页面
function output(content) {
  let outputEl = document.querySelector('#output')

  let html = ''
  for (let value of content) {
    html += `<p>${value}</p>`
  }
  outputEl.innerHTML = html
}
