import {
  Vector3
} from 'three';
import {dateToJulianDate} from './util';

export class Mechanics {
  static getCurrentKeplerianElements(object) {
    let date = new Date();
    let julianDate = dateToJulianDate(date);
    let ephemerisDiff = (julianDate - 2451545.0) / 36525;
    let initialElements = object.orbit.keplerianElements.initial;
    let elementRates = object.orbit.keplerianElements.rates;
    let currentElements = {};
    for (let key in initialElements) {
      currentElements[key] = initialElements[key] + (elementRates[key] * ephemerisDiff);
    }
    return currentElements;
  }
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
