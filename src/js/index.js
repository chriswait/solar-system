import {solarSystem} from './data';
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
import OrbitControls from './lib/controls';
var renderer, camera, scene, controls;
var time;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const NEAR =  0.1;
const FAR = 10000;
const VIEW_ANGLE = 50;

const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;

var getMeshForObject = function(object) {
  var geometry, material, mesh;
    geometry = new SphereGeometry(
      object.radius,
      SPHERE_SEGMENTS,
      SPHERE_RINGS
    );
  if (object.star) {
    material = new MeshDepthMaterial(
      {
        color: object.color
      }
    );
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
var getLightForObject = function(object) {
  var light = new PointLight(object.color, 1, 0);
  return light;
};
var geOrbitMeshForObject = function(object) {
  var geometry, material, mesh;
  geometry = new RingGeometry(
    object.orbit.radius+2,
    object.orbit.radius-2,
    360
  );
  material = new MeshBasicMaterial({
    color: object.color
  });
  mesh = new Mesh(geometry, material);
  return mesh;
};

function init() {
  renderer = new WebGLRenderer();
  camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new Scene();
  controls = new OrbitControls(camera);
  controls.target.set(0, 0, 0)
  camera.position.x = -1200;
  camera.position.y = 400;
  scene.add(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  time = 0;

  var loader = new TextureLoader();
  loader.load(
    'images/galaxy_starfield.png',
    function(texture) {
      var material = new MeshBasicMaterial({
        map: texture
      });
      var geometry = new SphereGeometry(1000, 32, 32);
      var mesh = new Mesh(geometry, material);
      mesh.material.side = BackSide;
      console.log(BackSide);
      scene.add(mesh);
    }
  );

  solarSystem.forEach(function(object) {
    object.mesh = getMeshForObject(object)
    object.mesh.position.set(0,0,0);
    scene.add(object.mesh);
    if (object.star) {
      object.star.mesh = getLightForObject(object);
      object.star.mesh.position.set(0, 0, 0);
      scene.add(object.star.mesh);
    }
    if (object.orbit) {
      object.orbit.mesh = geOrbitMeshForObject(object);
      object.orbit.mesh.position.set(0, 0, 0);
      object.orbit.mesh.rotation.set(Math.PI/2, 0, 0);
      scene.add(object.orbit.mesh);
    }
  });
  camera.lookAt(solarSystem[0].mesh.position);
}

function render() {
  time += 0.01;
  solarSystem.forEach(function(object) {
    if (object.orbit && object.orbit.mesh) {
      object.mesh.position.x = object.orbit.radius * Math.cos(time);
      object.mesh.position.z = object.orbit.radius * Math.sin(time);
    }
  });
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();
requestAnimationFrame(render);
