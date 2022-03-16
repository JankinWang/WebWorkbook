# 分片上传文件

分片上传文件实例，前端+php 后端

## 首先 Html 页面 引入 uploadFileAsSlice-browser.js

```html
<script src="./uploadFileAsSliceClass.js"></script>
```

### 创建实例

```js
const supld = new SliceUpload(files)
```

## 实例方法

### supld.on()

添加事件监听

**参数:**
**name** 事件名, 可选值如下:

- progress 上传进度
- done 上传完成一个
- doneAll 上传完成所有

**callback** 事件处理器函数, 回调参数如下:

- event 对象
  - event.done 是否上传完成
  - event.fileId 文件 id, 在 files 数组中的 index
  - event.progress 此文件上传进度
  - event.filename 此文件名

### supld.upload(url)

触发上传

### supld.fileSlicer(file)

返回一个生成器, 每次迭代返回一个文件切片, 可以用来自定义上传逻辑

**每个切片的数据结构:**

```js
{
  name: 'xxx.png',    // 文件名
  count: 10,     // 总片数
  file: `<bin>`,      // 切片的二进制数据
  index: 0,     // 切片序号
  chunkSize: 1024, // 切片大小
  fileSize: 10240,  // 整个文件大小
}
```
