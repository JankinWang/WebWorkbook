import ScrollEventMix from './ScrollEventMix.js'

let scrollParent = document.querySelector('#scrollParent')
let subDiv = document.querySelectorAll('.subDiv')

function subDivShow(isView) {
  subDiv.forEach((item) => {
    if (
      isView(item, {
        range: {
          top: 100,
          bottom: 100,
        },
      })
    ) {
      item.classList.remove('hidden')
    }
  })
}

const sh = new ScrollEventMix(scrollParent)
sh.addEventListener('view', subDivShow, true)
