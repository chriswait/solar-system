import {
  Vector3
} from 'three';

export class Mechanics {
  static getPositionForObjectAtTime(object, time) {
    var x, y, z;
    var position;
    x = object.orbit.radius * Math.cos(time);
    z = object.orbit.radius * Math.sin(time);
    y = 0;
    position = new Vector3(x, y, z);
    return position;
  }
}
