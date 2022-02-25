import chinaArea from './china-area-data-5.0.1/china-area-data-5.0.1/data.js';

const selectV1 = document.getElementById('v1');
const selectV2 = document.getElementById('v2');
const selectV3 = document.getElementById('v3');

/**
 * 为 select 设置选项
 *
 * @param {*} selectEl select 元素对象
 * @param {*} data 选项数据
 */
function setOptions(selectEl, data) {
  let optionHtmlText = '<option value="-1">--请选择--</option>';

  Object.keys(data).forEach((areaCode) => {
    const areaName = data[areaCode];
    optionHtmlText += `
    <option value="${areaCode}" data-area="${areaName}">${areaName}</option>
    `;
  });

  selectEl.innerHTML = optionHtmlText;
}

// 获取选中值
function getData() {
  return [
    selectV1.value,
    selectV2.value,
    selectV3.value,
  ]
}

// 初始化第一个选中器（省）
setOptions(selectV1, chinaArea['86']);

// 一级选择器监听（省）
selectV1.addEventListener('change', (event) => {
  const areaCode = event.target.value;
  setOptions(selectV2, chinaArea[areaCode]);
});

// 二级选择器监听（市）
selectV2.addEventListener('change', (event) => {
  const areaCode = event.target.value;
  setOptions(selectV3, chinaArea[areaCode]);
});

// 三级选择器监听（县、区）
selectV3.addEventListener('change', (event) => {
  const areaCode = event.target.value;
  console.log(getData());
});


