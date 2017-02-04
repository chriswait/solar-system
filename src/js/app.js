import {SolarSystemData} from './data';
import OrbitControls from './controls';
import {Mechanics} from './mechanics';
import {Screen} from './screen';
import {Universe} from './universe';
let universe, screen, controls;

function init() {
  screen = new Screen();
  screen.loadStars();
  controls = new OrbitControls(screen.camera);
  controls.target.set(0, 0, 0)

  universe = new Universe(SolarSystemData);
  universe.objects.forEach(function(object) {
    object.mesh = screen.drawObject(object);
    if (object.star) {
      object.star.mesh = screen.drawLightForObject(object);
    }
    if (object.orbit) {
      object.orbit.mesh = screen.drawOrbitForObject(object);
    }
  });
}

function render() {
  universe.step();
  universe.objects.forEach(function(object) {
    if (object.orbit) {
      var newPosition = Mechanics.getPositionForObjectAtTime(object, universe.time);
      object.mesh.position.copy(newPosition);
    }
  });
  controls.update();
  screen.render();
  requestAnimationFrame(render);
}

init();
requestAnimationFrame(render);
