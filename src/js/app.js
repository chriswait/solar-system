import {SolarSystemData} from './data';
import OrbitControls from './controls';
import {Mechanics} from './mechanics';
import {Screen} from './screen';
import {Universe} from './universe';

export class App {
  universe;
  screen;
  controls;
  constructor() {
  }
  init() {
    this.screen = new Screen();
    this.screen.loadStars();
    this.controls = new OrbitControls(this.screen.camera);
    this.controls.target.set(0, 0, 0)

    this.universe = new Universe(SolarSystemData);
    this.universe.objects.forEach((object) => {
      object.mesh = this.screen.drawObject(object);
      if (object.star) {
        object.star.mesh = this.screen.drawLightForObject(object);
      }
      if (object.orbit) {
        object.orbit.mesh = this.screen.drawOrbitForObject(object);
      }
    });
    requestAnimationFrame(this.render.bind(this));
  }

  render() {
    this.universe.step();
    this.universe.objects.forEach((object) => {
      if (object.orbit) {
        var newPosition = Mechanics.getPositionForObjectAtTime(object, this.universe.time);
        object.mesh.position.copy(newPosition);
      }
    });
    this.controls.update();
    this.screen.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
