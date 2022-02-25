const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: 'shadow-md bg-purple-dark',
    scrollTo: true,
  },
})

tour.addStep({
  id: 'example-step',
  text: '在输入框键入要搜索的关键字',
  attachTo: {
    element: '.example-css-selector',
    on: 'bottom',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: '下一步',
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: 'example-step',
  text: '点击 搜索按钮开始搜索吧',
  attachTo: {
    element: '.serach-button',
    on: 'bottom',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: '完成',
      action: tour.next,
    },
  ],
})

tour.start()
