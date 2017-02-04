import {
  Vector3
} from 'three';
import {UniverseObject} from './universe-object';

export class Universe {
  time;
  objects;
  constructor(solarSystemData) {
    this.time = 0;
    this.origin = new Vector3(0, 0, 0)
    this.objects = [];
    for (let data of solarSystemData) {
      var object = new UniverseObject(data);
      this.objects.push(object);
    }
  }
  step() {
    this.time += 0.01;
  }
}
