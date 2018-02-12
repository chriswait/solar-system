import Vue from 'vue'
import App from './App'
import store from './store'

if (window.WebGLRenderingContext) {
  new Vue({
    el: '#app',
  store: store,
    components: {
      App,
    },
    template: '<App/>'
  })
} else {
  window.location = 'http://get.webgl.org/'
}
