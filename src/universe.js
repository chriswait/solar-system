import {Vector3} from 'three'
import SolarSystemData from './data/solar-system'
import {UniverseObject} from './universe-object'
import store from './store'

export class Universe {
  origin = new Vector3(0, 0, 0)
  constructor() {
    let objects = []
    SolarSystemData.objects.forEach((solarSystemObject) => {
      objects.push(new UniverseObject(solarSystemObject))
    })
    store.commit('setObjects', objects)
  }
  updatePositions() {
    let centuries = store.getters.centuriesPastJ2000
    store.getters.objects.forEach((object) => {
      if (object.orbit) {
        store.commit('setPositionForObject', {
          position: object.getPositionAtCenturiesPastJ2000(centuries),
          object: object
        })
      } else {
        store.commit('setPositionForObject', {
          position: this.origin,
          object: object
        })
      }
    })
  }
}
