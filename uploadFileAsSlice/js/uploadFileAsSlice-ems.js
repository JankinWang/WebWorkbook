// 旧实现, 转到 uploadFileSliceClass

/**
 * 切片文件上传
 *
 * @param {File} file 文件对象，input[file] 可获取
 * @param {object} config
 * @param {function} config.onProgress 上传进度处理器
 * @param {function} config.onDone 上传完成处理器
 * @return {Promise}
 */
function uploadFileAsSlice(file, options = {}) {
  let { url = '', isAutoUpload = false, onProgress = () => {} } = options
  // 文件切片
  const slicer = fileSlicer(file)

  if (isAutoUpload) {
    autoUpload(url, slicerWrapperGenerator(slicer), onProgress)
    onProgress = null
    return true
  }

  return slicerWrapperGenerator(slicer)
}

// 自动上传
async function autoUpload(url, slicer, onProgress) {
  for (let slice of slicer) {
    sleep(500)
    let formData = new FormData()

    let res = await fetch(url, {
      method: 'POST',
      body: slice.formData,
    })

    // 上传进度
    onProgress({
      progress: slice.percent,
      done: slice.percent >= 100,
      response: res,
    })
  }
}

// 切片包装器(生成器格式), 对fileSlicer的结果包装以方便使用
function* slicerWrapperGenerator(slicer) {
  // 循环读取切片
  for (let slice of slicer) {
    const formData = jsonToFormData(slice)
    const totalChunk = slice.count // 总片数
    const currentChunk = slice.index + 1 // 本次要上传第几片
    // 已完成进度
    const percent = ((currentChunk / totalChunk) * 100).toFixed(2)

    yield {
      formData,
      slice,
      percent,
    }
  }
}

/**
 * 文件切片生成器函数
 * 负责将文件接片,并返回
 *
 * @param {File} file
 * @returns {Iterator} 生产文件切片的迭代器
 */
function* fileSlicer(file) {
  const { name: fileName, size: fileSize } = file
  const { chunkSize, count } = howSlice(fileSize)

  // 输出文件信息
  console.table([
    {
      文件名: fileName,
      文件大小: fileSize,
      切片大小: chunkSize,
      切片个数: count,
    },
  ])

  // 真正的切片逻辑,每次循环产生一片
  for (let index = 0; index < count; index++) {
    let start = index * chunkSize,
      end = start + chunkSize,
      slice = file.slice(start, end)

    yield {
      name: fileName,
      fileSize,
      count,
      chunkSize,
      index,
      file: slice,
    }
  }
}

// 可选切片方案
const programme = [
  [5, 2], // 大于5M 时，按每个2M切片
  [10, 5],
  [20, 10],
  [100, 20],
  [200, 30],
]

/**
 * 根据文件大小决定切片方案
 *
 * @param {number} fileSize 文件大小
 * @return {object} {chunkSize, count} 切片大小和切片个数
 */
function howSlice(fileSize) {
  // 每片大小,默认等于文件大小
  let chunkSize = fileSize
  programme.forEach((item) => {
    if (fileSize >= item[0] * 1024 * 1024) {
      chunkSize = item[1] * 1024 * 1024
    }
  })

  return {
    // 切片大小
    chunkSize,
    // 切片个数
    count: Math.ceil(fileSize / chunkSize),
  }
}

/**
 * Json 转 FormData
 *
 * @param {*} json
 * @returns {FormData}
 */
function jsonToFormData(json) {
  let formData = new FormData()

  Object.keys(json).forEach((key) => {
    formData.append(key, json[key])
  })

  return formData
}

/**
 * 休眠函数
 *
 * @param {number} time 毫秒
 * @return {*}
 */
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
// 导出函数
export default uploadFileAsSlice
