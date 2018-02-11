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

  Vue.filter('round', function(value, decimals) {
    if(!value) {
      value = 0;
    }
    if(!decimals) {
      decimals = 0;
    }
    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return value;
  });

} else {
  window.location = 'http://get.webgl.org/'
}
