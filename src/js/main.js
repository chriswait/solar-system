import {App} from './app';

if (window.WebGLRenderingContext) {
  let app = new App();
  app.init();
} else {
  window.location = 'http://get.webgl.org/';
}
