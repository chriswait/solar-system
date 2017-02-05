import {
  Vector3
} from 'three';
import {UniverseObject} from './universe-object';

export class Universe {
  origin;
  objects;
  clock;
  constructor(solarSystemData, clock) {
    this.origin = new Vector3(0, 0, 0)
    this.objects = [];
    for (let data of solarSystemData) {
      var object = new UniverseObject(data);
      this.objects.push(object);
    }
    this.clock = clock;
  }
  updatePositions() {
    let currentCenturiesPastJ2000 = this.clock.getCurrentCenturiesPastJ2000();
    this.objects.forEach((object) => {
      if (object.orbit) {
        let newPositionCalc = object.getCurrentPosition(currentCenturiesPastJ2000);
        var newPosition = object.getPositionAtDate(this.clock.date);
        object.setCurrentPosition(newPosition);
      }
    });
  }
}
