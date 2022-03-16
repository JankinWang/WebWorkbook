;(function (window, fn) {
  // 注册全局变量
  window.SliceUpload = fn()
})(window, function () {
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

  /**
   * 切片上传文件
   * @method upload()
   * @method on()
   *
   * @class SliceUpload
   */
  class SliceUpload {
    constructor(files, config = {}) {
      const { url = null } = config
      this.url = url
      this.files = files
      this.config = Object.assign({}, config)

      // 事件注册表
      this.eventListeners = new Map()
    }

    // 可选切片方案
    programme = [
      [5, 2], // 大于5M 时，按每个2M切片
      [10, 5],
      [20, 10],
      [100, 20],
    ]

    _triggerEvent(name, e) {
      if (this.eventListeners.has(name)) {
        this.eventListeners.get(name).forEach((callback) => {
          callback(e)
        })
      }
    }

    _onProgress(e) {
      this._triggerEvent('progress', e)
    }
    _onDone(e) {
      this._triggerEvent('done', e)
    }
    _onDoneAll(e) {
      this._triggerEvent('doneAll', e)
    }

    // 设置事件
    on(name, callback) {
      if (this.eventListeners.has(name)) {
        this.eventListeners.get(name).push(callback)
      } else {
        this.eventListeners.set(name, [callback])
      }
    }

    // 触发上传
    upload(url = null) {
      url && (this.url = url)

      const allUper = this.files.map((file, index) => {
        // 以切片上传一个文件
        return this.sliceAndUpload(file, index)
      })

      Promise.all(allUper).then((res) => {
        this._onDoneAll(res)
      })
    }

    /**
     * 切片并上传一个文件
     *
     * @param {File} file
     * @param {string|number} fileId 可以表示文件唯一性的符号
     * @memberof SliceUpload
     */
    sliceAndUpload(file, fileId) {
      // 文件切片
      const slicer = this.fileSlicer(file)
      return this.autoUpload(this._slicerWrapperGenerator(slicer), fileId)
    }

    /**
     * 上传一个文件
     *
     * @memberof SliceUpload
     */
    autoUpload = async function (slicer, fileId) {
      // 循环上传所有切片
      for (let slice of slicer) {
        sleep(500)

        let res = await fetch(this.url, {
          method: 'POST',
          body: slice.formData,
        })

        if (res.ok) {
          const done = slice.percent >= 100,
            result = {
              progress: slice.percent,
              done,
              fileId,
              filename: slice.slice.name,
            }

          try {
            result.response = await res.json()
          } catch (error) {
            result.response = {}
          }

          // 上传进度
          this._onProgress(result)

          // 上传完成
          if (done) {
            this._onDone(result)
            return result
          }
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
    fileSlicer = function* (file) {
      const { name: fileName, size: fileSize } = file
      const { chunkSize, count } = this._howSlice(fileSize)

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

    /**
     * 根据文件大小决定切片方案
     *
     * @param {number} fileSize 文件大小
     * @return {object} {chunkSize, count} 切片大小和切片个数
     */
    _howSlice(fileSize) {
      // 每片大小,默认等于文件大小
      let chunkSize = fileSize
      this.programme.forEach((item) => {
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

    // 切片包装器(生成器格式), 对fileSlicer的结果包装以方便使用
    _slicerWrapperGenerator = function* (slicer) {
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
  }

  return SliceUpload
})
