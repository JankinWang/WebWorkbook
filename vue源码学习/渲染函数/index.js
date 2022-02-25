import Vue from '../../assets/js/vue.esm.browser.min.js';

const components = {
  SayHello: {
    props: {
      name: { type: String, default: '' },
    },
    render(h) {
      const { Header } = components;
      const text = `Hello ${this.name}!`;
      return h(Header, text);
    },
  },

  Header: {
    props: { level: { default: 1 } },
    functional: true,
    render(h, context) {
      const {props: {level}, slots} = context;

      let header = `h${level}`;
      return h(header, slots().default);
    },
  },
};


let vm =new Vue({
  el: '#app',
  render(h) {
    const { Header, SayHello } = components;

    const children = [
      h(SayHello, { props: { name: 'Vue' } }),
      h(
        Header,
        {
          props: {
            level: 2,
          },
        },
        'wzk'
      ),
    ];

    return h('div', children);
  },
});

console.log(vm);
