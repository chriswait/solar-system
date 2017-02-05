import {SolarSystemData} from './data';
import OrbitControls from './controls';
import {Screen} from './screen';
import {Universe} from './universe';
import {Clock} from './clock';

const CLOCK_RATE = 100;

export class App {
  screen;
  controls;
  clock;
  universe;
  constructor() {
  }
  init() {
    this.screen = new Screen();
    this.screen.loadStars();
    this.controls = new OrbitControls(this.screen.camera);
    this.controls.target.set(0, 0, 0)
    this.clock = new Clock(new Date(), CLOCK_RATE);
    this.universe = new Universe(SolarSystemData, this.clock);
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
    this.clock.tick();
    this.universe.updatePositions();
    this.universe.objects.forEach((object) => {
      if (object.orbit) {
        object.mesh.position.copy(object.getPositionAtDate(this.clock.date));
      }
    });
    this.controls.update();
    this.screen.render();
    setTimeout(() => {
      requestAnimationFrame(this.render.bind(this));
    }, CLOCK_RATE)
  }
}
