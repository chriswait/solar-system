var t;
var scene, camera, controls, renderer;
var geometry, material, mesh;
var sunGeo, sunMaterial, sunMat, sun;
var mercuryGeo, mercuryMaterial, mercuryMat, mercury;

function init() {
  t = 0;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  controls = new THREE.OrbitControls(camera);
  // controls.addEventListener('change', render);
  controls.target.set(0, 0, 0)
  camera.position.z = 1000;

  sunGeo = new THREE.SphereGeometry(80, 32, 32);
  sunMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  sun = new THREE.Mesh(sunGeo, sunMaterial);
  sun.position.set(0,0,0);
  scene.add(sun);

  mercuryGeo = new THREE.SphereGeometry(50, 32, 32);
  mercuryMaterial = new THREE.MeshBasicMaterial({color: 0x4caf50});
  mercury = new THREE.Mesh(mercuryGeo, mercuryMaterial);
  mercury.position.set(0,0,0);
  scene.add(mercury);

  mercuryPathGeo = new THREE.CircleGeometry( 50, 32, 32, Math.PI * 2 );
  mercuryPathMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  mercuryPath = new THREE.Mesh(mercuryPathGeo, mercuryPathMaterial);
  mercuryPath.position.set(0,0,0);
  scene.add(mercuryPath);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function render() {
  requestAnimationFrame(render);
  t += 0.01;
  // sun.rotation.y += 0.005;
  // mercury.rotation.y += 0.03;

  mercury.position.x = 400*Math.cos(t) + 0;
  mercury.position.z = 400*Math.sin(t) + 0; // These to strings make it work
  // console.log(t);
  // console.log(sun.rotation.x, sun.rotation.y);
  // console.log(mercury.rotation.x, mercury.rotation.y);
  controls.update();
  renderer.render(scene, camera);
}

init();
render();
