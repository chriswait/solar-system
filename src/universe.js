import {Vector3} from 'three'
import {UniverseObject} from './universe-object'

export class Universe {
  origin = new Vector3(0, 0, 0)
  objects = []
  constructor(solarSystemObjects) {
    solarSystemObjects.forEach((solarSystemObject) => {
      this.objects.push(new UniverseObject(solarSystemObject))
    })
  }
  updatePositions(currentCenturiesPastJ2000) {
    this.objects.forEach((object) => {
      if (object.orbit) {
        object.setPosition(object.getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000))
      } else {
        object.setPosition(this.origin)
      }
    })
  }
}
