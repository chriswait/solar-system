import {
  Vector3,
} from 'three';

export class UniverseObject {
  name;
  radius;
  color;
  orbit;
  orbits;
  mesh;
  currentPosition;
  constructor(object) {
    for (let key of Object.keys(object)) {
      if (object[key]) {
        this[key] = object[key];
      }
    }
  }
  setCurrentPosition(newPosition) {
    if (typeof(this.currentPosition) === 'undefined') {
      this.currentPosition = newPosition;
    } else {
      this.currentPosition.copy(newPosition);
    }
  }
  getCurrentKeplerianElements(currentCenturiesPastJ2000) {
    let currentElements = {};
    for (let key in this.orbit.keplerianElements.initial) {
      currentElements[key] = this.orbit.keplerianElements.initial[key] + (this.orbit.keplerianElements.rates[key] * currentCenturiesPastJ2000);
    }
    return currentElements;
  }
  getPositionAtDate(date) {
    // TODO - replace this with actual logic
    let x, y, z;
    let position;
    x = this.orbit.radius * Math.cos(date);
    z = this.orbit.radius * Math.sin(date);
    y = 0;
    position = new Vector3(x, y, z);
    return position;
  }
}
