import Vue from 'vue'
import App from './App'

if (window.WebGLRenderingContext) {
  new Vue({
    el: '#app',
    components: {
      App,
    },
    template: '<App/>'
  })
} else {
  window.location = 'http://get.webgl.org/'
}
