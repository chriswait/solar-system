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

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const NEAR =  0.1;
const FAR = 1000;
const VIEW_ANGLE = 90;

const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;

const ORBIT_MAX_UNITS = 500;
const PLUTO_ORBIT_KM = 5906292480;
const ORBIT_SCALE_FACTOR = ORBIT_MAX_UNITS / PLUTO_ORBIT_KM;

export class Screen {
  renderer;
  camera;
  scene;
  controls;
  constructor() {
    this.renderer = new WebGLRenderer();
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene = new Scene();
    this.camera.position.y = 500;
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
        geometry = new SphereGeometry(2000, 32, 32);
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
      position.x * ORBIT_SCALE_FACTOR,
      position.y * ORBIT_SCALE_FACTOR,
      position.z * ORBIT_SCALE_FACTOR
    );
    return newPositionScaled;
  }

  redrawObject(object) {
    let newPositionScaled = this.scaleRealToVisualised(object.currentPosition);
    object.mesh.position.copy(newPositionScaled);
  }

  drawObject(object) {
    var mesh;
    mesh = Screen.getMeshForObject(object);
    this.scene.add(mesh);
    return mesh;
  }
  static getMeshForObject(object) {
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
    light = Screen.getLightForObject(object);
    light.position.copy(object.mesh.position);
    this.scene.add(light);
    return light;
  }
  static getLightForObject(object) {
    var light = new PointLight(object.color, 1, 0);
    return light;
  }

  drawOrbitForObject(object) {
    var mesh;
    mesh = Screen.getOrbitMeshForObject(object);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(Math.PI/2, 0, 0);
    this.scene.add(mesh);
    return mesh;
  }
  static getOrbitMeshForObject(object) {
    var geometry, material, mesh;
    let radius = (object.orbit.radius * ORBIT_SCALE_FACTOR);
    geometry = new RingGeometry(
      radius + 0.1,
      radius - 0.1,
      360
    );
    material = new MeshBasicMaterial({
      color: object.color
    });
    mesh = new Mesh(geometry, material);
    return mesh;
  }
}
