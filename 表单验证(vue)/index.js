import Vue from '../assets/js/vue.esm.browser.min.js'

// 创建Vue插件
const validationPlugin = {
  install(Vue) {
    // 混入一个 $v 计算属性
    Vue.mixin({
      computed: {
        $v() {
          const rules = this.$options.validations
          if (rules) {
            let valid = true
            let error = []

            Object.keys(rules).forEach((key) => {
              const rule = rules[key]
              const value = this[key]
              const result = rule.validate(value)

              if (!result) {
                valid = false
                error.push(rule.message)
              }
            })

            return {
              valid,
              error,
            }
          }
        },
      },
    })
  },
}

// 安装插件
Vue.use(validationPlugin)

new Vue({
  el: '#app',
  data() {
    return {
      name: '',
      age: 0,
    }
  },
  computed: {},
  validations: {
    name: {
      validate: (value) => value.toString().length >= 5,
      message: 'name length must bigeer 5',
    },
    age: {
      validate: (value) => value > 0 && value < 100,
      message: 'age should is between 0 and 100',
    },
  },

  mounted() {
    console.log(this)
  },
})
