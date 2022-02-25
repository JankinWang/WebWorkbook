# 分片上传文件
分片上传文件实例，前端+php后端

## 基本用法

1.   #### 首先Html 页面 引入 uploadFileAsSlice-browser.js

     ```html
      <script src="./uploadFileAsSlice-browser.js"></script>
     ```

2.   #### 全局方法只有 uploadFileAsSlice

     基本用法

     ```js
     // uploadFileAsSlice 接收一个对象作为参数，并返回 Promise。
     // 多文件上传就多次调用 uploadFileAsSlice 即可
     
     let config = {
         file, // 文件对象，input[type=file] 可获取
     
         // 上传
         onUpload(formData, context) {
         	// onUpload 期望返回一个Promise
             // 只有这样 onProgress onDone 才有效
            	return axios.post('http://www.test.com/', formData);
         },
     
          // 文件上传进度回调
          onProgress: function (percent, totalChunk, currentChunk) {
             // 这里放自己的处理逻辑
          },
     
          // 文件上传完成回调
          onDone(res) {
             console.log(res)
          }
     }
     
     uploadFileAsSlice(config);
     ```

     

## 参数对象 Options

### file

文件的二进制对象，一般是在 input[type=file] 元素的 change 事件回调中获取。

### onUpload

这是将上传动作移交给用户的一个方法，一般会触发1次或多次（文件的每个切片都会触发一次）。

#### 参数

-   formData

    是用以下 Json 数据创建的 FormData 实例，可直接用ajax发送给后端。

    ```json
    {
      	name: 'xxx.png',
      	fileSize: 10240,
      	chunks: 10,   // 总切片个数
      	chunkSize: 1024, // 每个切片的大小
      	chunk: 0, // 切片索引
      	file: <bin>, // 一个文件切片(二进制)
    }
    ```

    

-   context

    包含当前文件切片的信息，可以用来自行处理上传进度等。

    ```json
    {
        slice: '<bin>', // 本次回调的文件切片(二进制)
        lastChunk: false, // 是否最后一块切片
        progress: { // 当前进度
            totalChunk,
            currentChunk,
            percent
        }
    }
    ```

注：onUpload 中如果返回的是一个 Promise，那么将以队列的形式逐个上传文件切片，即上传成功一个再上传下一个。如果想自己处理上传逻辑，可以不返回 Promise。这样的 onUpload 就像是 array.forEach 的回调函数，一次性遍历完所有的文件切片。同时 onProgress 将失效，onDone 则表示遍历完毕，但与是否上传完成无关。 

### onProgress

上传进度回调，只有当 onUpload 的返回值是一个 Promise 实例时才会触发。

#### 参数

-   percent 百分比，如： 1 代表 1%
-   totalChunk 文件切片总数
-   currentChunk 当前上传完成的是第几个切片



### onDone

文件上传完成回调

#### 参数

-   response 最后一次切片上传成功，服务端的响应数据。一般在最后一次上传成功后，返回文件的Url。



