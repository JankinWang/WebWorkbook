import ScrollEventMix from './ScrollEventMix.js';

let scrollParent = document.querySelector('#scrollParent');
let subDiv = document.querySelectorAll('.subDiv');

function subDivShow(isView) {
  subDiv.forEach((item) => {
    if (isView(item)) {
      item.classList.remove('hidden');
    }
  });
}

const sh = new ScrollEventMix(scrollParent);
sh.addHandler('view', subDivShow, true);
