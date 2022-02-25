export default function (label, fun) {
  console.time(label)
  fun()
  console.timeEnd(label)
}
