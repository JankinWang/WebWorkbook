/**
 * 本地搜索记录
 *
 * @class SearchHistory
 */
class SearchHistory {
  constructor(HistoryList) {
    this.HistoryList = Array.isArray(HistoryList) ? HistoryList : []
  }

  /**
   * 添加记录
   *
   * @param {string} text 文本
   * @memberof SearchHistory
   */
  setHistory(text) {
    if (Array.isArray(text)) {
      this.HistoryList = Array.from(new Set([].concat(this.HistoryList, text)))
    } else if (typeof text === 'string' && !this.HistoryList.includes(text)) {
      this.HistoryList.push(text)
    }
  }

  // 清空记录
  clearHistory() {
    this.HistoryList = []
  }

  /**
   * 筛选历史记录
   *
   * @param {string} keyword 查询关键字
   * @return {string[]}
   * @memberof SearchHistory
   */
  filterHistory(keyword) {
    // 分解关键词
    let keyArr = this._fenci(keyword)
    let result = []

    for (let text of this.HistoryList) {
      let flag = false

      for (let key of keyArr) {
        if (text.includes(key)) {
          flag = true
          text = this._noteKeyword(text, key)
        }
      }

      flag && result.push(text)
    }

    // 没有记录,则添加新记录
    if (result.length <= 0) {
      this.setHistory([keyword])
    }
    return result
  }

  // 根据空格标点分词
  _fenci(text) {
    text = text.trim()
    return text.split(/[\,\，\s]/)
  }

  // 标记出配到的关键字
  _noteKeyword(text, keyword) {
    let regx = new RegExp(keyword, 'g')
    return text.replace(regx, `<em>${keyword}</em>`)
  }
}
