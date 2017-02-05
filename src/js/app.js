import {SolarSystemData} from './data';
import OrbitControls from './controls';
import {Screen} from './screen';
import {Universe} from './universe';
import {Clock} from './clock';

const CLOCK_RATE = 1000;

export class App {
  screen;
  controls;
  clock;
  universe;
  t;
  constructor() {
  }
  init() {
    this.t = 0;
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
    this.t += 0.01;
    this.clock.tick();
    this.universe.updatePositions(this.t);
    this.universe.objects.forEach((object) => {
      this.screen.redrawObject(object);
    });
    this.controls.update();
    this.screen.render();
    setTimeout(() => {
      requestAnimationFrame(this.render.bind(this));
    }, 1)
  }
}
