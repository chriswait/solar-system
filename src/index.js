import {App} from './app';
import './styles/index.css';

if (window.WebGLRenderingContext) {
  let app = new App();
  app.init();
} else {
  window.location = 'http://get.webgl.org/';
}
