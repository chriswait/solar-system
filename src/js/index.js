var renderer, camera, scene, controls;
var time;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const NEAR =  0.1;
const FAR = 10000;
const VIEW_ANGLE = 45;

const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;

var solarSystem = [
  {
    name: "sun",
    radius: 80,
    color: 0xffffff,
    star: {
    }
  },
  {
    name: "mercury",
    radius: 30,
    color: 0x4caf50,
    orbit: {
      radius: 400
    }
  },
  {
    name: "venus",
    radius: 40,
    color: 0xbbbbbb,
    orbit: {
      radius: 800
    }
  }
];

var getMeshForObject = function(object) {
  var geometry, material, mesh;
    geometry = new THREE.SphereGeometry(
      object.radius,
      SPHERE_SEGMENTS,
      SPHERE_RINGS
    );
  if (object.star) {
    material = new THREE.MeshDepthMaterial(
      {
        color: object.color
      }
    );
  } else {
    material = new THREE.MeshLambertMaterial(
      {
        color: object.color
      }
    );
  }
  mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
var getLightForObject = function(object) {
  var light = new THREE.PointLight(object.color, 1, 0);
  return light;
};
var geOrbitMeshForObject = function(object) {
  var geometry, material, mesh;
  geometry = new THREE.RingGeometry(
    object.orbit.radius+2,
    object.orbit.radius-2,
    360
  );
  material = new THREE.MeshBasicMaterial({
    color: object.color
  });
  mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

function init() {
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new THREE.Scene();
  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 0, 0)
  camera.position.x = -1500;
  camera.position.y = 300;
  scene.add(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  time = 0;
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
}

function render() {
  time += 0.01;
  solarSystem.forEach(function(object) {
    if (object.orbit && object.orbit.mesh) {
      object.mesh.position.x = object.orbit.radius * Math.cos(time);
      object.mesh.position.z = object.orbit.radius * Math.sin(time);
    }
  });
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();
requestAnimationFrame(render);
