import {
  SphereGeometry, RingGeometry,
  MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial,
  Mesh,
  PointLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  BackSide
} from 'three';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const NEAR =  0.1;
const FAR = 10000;
const VIEW_ANGLE = 50;

const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;

export class Screen {
  renderer;
  camera;
  scene;
  controls;
  constructor() {
    this.renderer = new WebGLRenderer();
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene = new Scene();
    this.camera.position.x = -1200;
    this.camera.position.y = 400;
    this.scene.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  loadStars() {
    var loader = new TextureLoader();
    loader.load(
      'images/galaxy_starfield.png',
      (texture) => {
        let material, geometry, mesh;
        material = new MeshBasicMaterial({
          map: texture
        });
        geometry = new SphereGeometry(1000, 32, 32);
        mesh = new Mesh(geometry, material);
        mesh.material.side = BackSide;
        this.scene.add(mesh);
      }
    );
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  drawObject(object) {
    var mesh;
    mesh = Screen.getMeshForObject(object);
    mesh.position.set(0,0,0);
    this.scene.add(mesh);
    return mesh;
  }
  drawLightForObject(object) {
    var mesh;
    mesh = Screen.getLightForObject(object.star);
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
    return mesh;
  }
  drawOrbitForObject(object) {
    var mesh;
    mesh = Screen.geOrbitMeshForObject(object);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(Math.PI/2, 0, 0);
    this.scene.add(mesh);
    return mesh;
  }
  static getMeshForObject(object) {
    var geometry, material, mesh;
    geometry = new SphereGeometry(
      object.radius,
      SPHERE_SEGMENTS,
      SPHERE_RINGS
    );
    if (object.star) {
      material = new MeshDepthMaterial();
    } else {
      material = new MeshLambertMaterial(
        {
          color: object.color
        }
      );
    }
    mesh = new Mesh(geometry, material);
    return mesh;
  }
  static getLightForObject(object) {
    var light = new PointLight(object.color, 1, 0);
    return light;
  }
  static geOrbitMeshForObject(object) {
    var geometry, material, mesh;
    geometry = new RingGeometry(
      object.orbit.radius+1,
      object.orbit.radius-1,
      360
    );
    material = new MeshBasicMaterial({
      color: object.color
    });
    mesh = new Mesh(geometry, material);
    return mesh;
  }
}
