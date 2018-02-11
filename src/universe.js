import {Vector3} from 'three'
import SolarSystemData from './data/solar-system'
import {UniverseObject} from './universe-object'
import store from './store'

export class Universe {
  origin = new Vector3(0, 0, 0)
  objects = []
  constructor() {
    SolarSystemData.objects.forEach((solarSystemObject) => {
      if (solarSystemObject.name === 'sun'|| solarSystemObject.name === 'earth') {
        this.objects.push(new UniverseObject(solarSystemObject))
      }
    })
  }
  updatePositions() {
    let centuries = store.getters.clockCenturiesPastJ2000
    this.objects.forEach((object) => {
      if (object.orbit) {
        object.setPosition(object.getPositionAtCenturiesPastJ2000(centuries))
      } else {
        object.setPosition(this.origin)
      }
    })
  }
}
