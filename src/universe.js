import {
  Vector3
} from 'three'
import {UniverseObject} from './universe-object'

export class Universe {
  origin
  objects
  clock
  constructor(solarSystemObjects, clock) {
    this.origin = new Vector3(0, 0, 0)
    this.objects = []
    for (let solarSystemObject of solarSystemObjects) {
      this.objects.push(new UniverseObject(solarSystemObject))
    }
    this.clock = clock
  }
  updatePositions() {
    let currentCenturiesPastJ2000 = this.clock.getCurrentCenturiesPastJ2000()
    this.objects.forEach((object) => {
      if (object.orbit) {
        let newPosition = object.getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000)
        object.setPosition(newPosition)
      } else {
        object.setPosition(this.origin)
      }
    })
  }
}
