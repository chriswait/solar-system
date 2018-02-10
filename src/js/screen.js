import {
  SphereGeometry, RingGeometry,
  MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial,
  Mesh,
  PointLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  BackSide,
  Vector3
} from 'three';
import {Util} from './util';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const NEAR =  0.1;
const FAR = 2000;
const VIEW_ANGLE = 90;

const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;

const ORBIT_MAX_UNITS = 500;

export class Screen {
  renderer;
  camera;
  scene;
  controls;
  constructor(universe) {
    this.renderer = new WebGLRenderer();
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene = new Scene();
    this.setScale(universe);
    this.camera.position.x = 20;
    this.camera.position.y = 20;
    this.scene.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.loadStars();
  }
  setScale(universe) {
    let lastObject = universe.objects[universe.objects.length-1];
    let furthestOrbitMeters = Util.auToMeters(lastObject.orbit.keplerianElements.initial.semiMajorAxisAu);
    this.scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters;
  }
  loadStars() {
    var loader = new TextureLoader();
    loader.load(
      'src/images/galaxy_starfield.png',
      (texture) => {
        let material, geometry, mesh;
        material = new MeshBasicMaterial({
          map: texture
        });
        geometry = new SphereGeometry(ORBIT_MAX_UNITS, 32, 32);
        mesh = new Mesh(geometry, material);
        mesh.material.side = BackSide;
        this.scene.add(mesh);
      }
    );
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  scaleRealToVisualised(position) {
    let newPositionScaled = new Vector3(
      position.x * this.scaleFactor,
      position.y * this.scaleFactor,
      position.z * this.scaleFactor
    );
    return newPositionScaled;
  }

  redrawObject(object) {
    let newPositionScaled = this.scaleRealToVisualised(object.position);
    object.mesh.position.copy(newPositionScaled);
  }

  drawObject(object) {
    var mesh;
    mesh = this.getMeshForObject(object);
    this.scene.add(mesh);
    return mesh;
  }
  getMeshForObject(object) {
    var geometry, material, mesh;
    geometry = new SphereGeometry(
      2,
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

  drawLightForObject(object) {
    var light;
    light = this.getLightForObject(object);
    light.position.copy(object.mesh.position);
    this.scene.add(light);
    return light;
  }
  getLightForObject(object) {
    var light = new PointLight(object.color, 1, 0);
    return light;
  }

  drawOrbitForObject(object) {
    var mesh;
    mesh = this.getOrbitMeshForObject(object);
    mesh.position.set(0, 0, 0);
    // mesh.rotation.set(Math.PI/2, 0, 0);
    this.scene.add(mesh);
    return mesh;
  }
  getOrbitMeshForObject(object) {
    var geometry, material, mesh;

    let radius = (Util.auToMeters(object.orbit.keplerianElements.initial.semiMajorAxisAu) * this.scaleFactor);
    geometry = new RingGeometry(
      radius + 0.01,
      radius - 0.01,
      360
    );
    material = new MeshBasicMaterial({
      color: object.color
    });
    mesh = new Mesh(geometry, material);
    return mesh;
  }
}
