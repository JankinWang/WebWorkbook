import Vue from '../../assets/js/vue.esm.browser.min.js';

// 用一个Vue实例来管理公共的状态
// const state = new Vue({
//   data: {
//     count: 0
//   }
// })

// 实现简易VueX
function createStore({ state, mutations }) {
  return new Vue({
    data: {state},
    methods: {
      commit(mutationID, ...options) {
        mutations[mutationID](this.state, ...options);
      },
    },
  });
}

// 创建 状态管理
const store = createStore({
  state: { count: 0 },
  mutations: {
    inc(state) {
      state.count++;
    },
  },
});

console.log(store);

// 应用组件
const components = {
  Counter: {
    render(h) {
      return h('div', store.state.count);
    },
  },
};

let vm = new Vue({
  components,
  methods: {
    add() {
      store.commit('inc');
    },
  },
});

vm.$mount('#app');
