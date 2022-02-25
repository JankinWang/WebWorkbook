const MyPromise = require('./MyPromise')
const iPromise = require('./iPromise')

// let iP = new iPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1)
//     // reject(error)
//   }, 500)
// })
//   .then((value) => {
//     console.log('then', value)
//     return new iPromise((resolve) => {
//       const p = new iPromise((resolve) => {
//         resolve('inner iPromise')
//       })
//       resolve(p)
//     })
//   })
//   .then((value) => {
//     console.log('then', value)
//     return new iPromise((resolve) => {
//       resolve(value)
//     })
//   })
//   .then((value) => {
//     console.log('then', value)
//   })
//   .catch((e) => {
//     console.log(e.message)
//   })

// MyPromise.resolve()
//   .then(() => {
//     console.log(0)
//     return MyPromise.resolve(4)
//   })
//   .then((res) => {
//     console.log(res)
//   })

// MyPromise.resolve()
//   .then(() => {
//     console.log(1)
//   })
//   .then(() => {
//     console.log(2)
//   })
//   .then(() => {
//     console.log(3)
//   })
//   .then(() => {
//     console.log(5)
//   })
//   .then(() => {
//     console.log(6)
//   })

// Promise.resolve()
//   .then(() => {
//     console.log(0)
//     return Promise.resolve(4)
//   })
//   .then((res) => {
//     console.log(res)
//   })

// Promise.resolve()
//   .then(() => {
//     console.log(1)
//   })
//   .then(() => {
//     console.log(2)
//   })
//   .then(() => {
//     console.log(3)
//   })
//   .then(() => {
//     console.log(5)
//   })
//   .then(() => {
//     console.log(6)
//   })

// const p = MyPromise.resolve(MyPromise.resolve(MyPromise.reject(666)))
// p.then((res) => console.log(res)).catch((err) => console.log(err))
