/**
 * 切片文件上传
 *
 * @param {File} file 文件对象，input[file] 可获取
 * @param {object} config
 * @param {function} config.onProgress 上传进度处理器
 * @param {function} config.onDone 上传完成处理器
 * @return {Promise}
 */
async function uploadFileAsSlice(config) {
  const { file, onUpload, onProgress = null, onDone = null } = config;
  // 文件切片
  const slicer = fileSlicer(file);

  // 循环读取切片
  for (let slice of slicer) {
    const context = Object(null);
    const formData = jsonToFormData(slice);
    const totalChunk = slice.chunks; // 总片数
    const currentChunk = slice.chunk + 1; // 本次要上传第几片
    const percent = ((currentChunk / totalChunk) * 100).toFixed(2); // 已完成百分比

    context.slice = slice;
    context.lastChunk = totalChunk === currentChunk; // 为 true 表示是最后一个切片
    context.progress = { totalChunk, currentChunk, percent };

    try {
      // TODO 失败重试
      // while (!(res.code === 'ok' || retryCount >= 3)) {
      let handlerUpload = onUpload(formData, context);
      let isPromise = handlerUpload instanceof Promise;
      var res = await handlerUpload;
      // }

      /**
       * 如果 onUpload 返回的不是 Promise
       * 则后面的 onProgress 将失去意义。
       * onDone 也只能表示所有切片都调用了上传方法
       */

      // 上传进度监听
      if (isPromise && typeof onProgress === 'function') {
        onProgress(percent, totalChunk, currentChunk);
      }
    } catch (error) {
      error.message = error.message + ' 上传切片失败';
      throw error;
    }

    // 休眠 200ms，减轻并发压力
    await sleep(200);
  }

  // 上传完成
  if (typeof onDone === 'function') {
    onDone(res.data);
  }

  return res.data;
}

/**
 * 文件切片生成器函数
 *
 * @param {File} file
 * @returns {Iterator} 生产文件切片的迭代器
 */
function* fileSlicer(file) {
  const { name: fileName, size: fileSize } = file;
  const { chunkSize, chunks } = getSlicerNum(fileSize);

  // 输出文件信息
  console.table([
    {
      文件名: fileName,
      文件大小: fileSize,
      切片大小: chunkSize,
      切片个数: chunks,
    },
  ]);

  // 真正的切片逻辑
  for (let index = 0; index < chunks; index++) {
    let start = index * chunkSize,
      end = start + chunkSize,
      slice = file.slice(start, end);

    yield {
      name: fileName,
      fileSize,
      chunks,
      chunkSize,
      chunk: index,
      file: slice,
    };
  }
}

/**
 * 根据文件大小选择切片方案
 *
 * @param {number} fileSize 文件大小
 * @return {object} {chunkSize, chunks} 切片大小和切片个数
 */
function getSlicerNum(fileSize) {
  // 可选方案
  const programme = [
    [5, 2], // 大于5M 时，按每个2M切片
    [10, 5],
    [20, 10],
    [100, 20],
    [200, 30],
    // [500, 50],
    // [800, 60],
  ];

  // 挑选方案
  let chunkSize = fileSize;
  programme.forEach((item) => {
    if (fileSize >= item[0] * 1024 * 1024) {
      chunkSize = item[1] * 1024 * 1024;
    }
  });

  return {
    // 切片大小
    chunkSize,
    // 切片个数
    chunks: Math.ceil(fileSize / chunkSize),
  };
}

/**
 * Json 转 FormData
 *
 * @param {*} json
 * @returns {FormData}
 */
function jsonToFormData(json) {
  let formData = new FormData();

  Object.keys(json).forEach((key) => {
    formData.append(key, json[key]);
  });

  return formData;
}

/**
 * 休眠函数
 *
 * @param {*} time
 * @return {*}
 */
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// 导出函数
export default uploadFileAsSlice;
