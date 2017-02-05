import {
  Vector3
} from 'three';
import {UniverseObject} from './universe-object';

export class Universe {
  origin;
  objects;
  clock;
  constructor(solarSystemData, clock) {
    this.origin = new Vector3(0, 0, 0);
    this.objects = [];
    for (let data of solarSystemData) {
      if (['sun', 'earth', 'pluto'].indexOf(data.name) !== -1) {
        var object = new UniverseObject(data);
        this.objects.push(object);
      }
    }
    this.clock = clock;
  }
  updatePositions(t) {
    // let currentCenturiesPastJ2000 = this.clock.getCurrentCenturiesPastJ2000();
    this.objects.forEach((object) => {
      // let newPositionCalc = object.getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000);
      let newPosition = object.getPositionAtT(t);
      object.setCurrentPosition(newPosition);
    });
  }
}
