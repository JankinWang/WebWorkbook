let activeUpdate = null;
// 依赖管理对象
class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  
  depend() {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate);
    }
  }

  // 通知所有订阅者
  notify() {
    this.subscribers.forEach((sub) => sub());
  }
}


// 将对象转为响应式
function observe(obj) {
  const dep = new Dep();

  Object.keys(obj).forEach((key) => {
    let internalValue = obj[key];

    Object.defineProperty(obj, key, {
      get() {
        dep.depend()
        return internalValue;
      },
      set(newValue) {
        let changed = newValue !== internalValue;
        internalValue = newValue;

        if (changed) {
          dep.notify();
        }
      },
    });
  });
}

// 注册依赖者(观察者)
function autorun (update) {
  const wrappedUpdate = () => {
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}

// 创建一个类Vue实例
function initVue(vue) {
  // 
  observe(vue.data);

  // created hook
  vue.created();

  // 添加依赖
  Object.keys(vue.computed).forEach(key => {
    autorun(vue.computed[key].bind(vue))
  })
  
}


