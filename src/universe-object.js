import {Vector3} from 'three'
import {OrbitMechanics} from './orbit-mechanics'
import {ORBIT_POINTS} from './constants'

export class UniverseObject {
  name
  radius
  color
  orbit
  star
  position
  constructor(object) {
    this.name = object.name
    this.radius = object.radius
    this.color = object.color
    if (object.orbit) {
      this.orbit = {
        keplerianElements: object.orbit.keplerianElements
      }
    }
    this.star = object.star
  }

  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    if (!this.orbit) {
      return new Vector3(0, 0, 0)
    }
    let elements = OrbitMechanics.getElementsAtCenturiesPastJ2000(this.orbit.keplerianElements, currentCenturiesPastJ2000)
    return OrbitMechanics.getPositionForElements(elements)
  }

  getLastOrbitAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    if (!this.orbit) {
      return
    }

    let positions = []
    let siderealYears = 1 // for earth, todo for other objects
    let siderealCenturies = siderealYears / 100
    let stepCenturies = siderealCenturies / ORBIT_POINTS
    let startCenturies = currentCenturiesPastJ2000 - siderealCenturies

    let centuries
    for (let iteration = 0; iteration < ORBIT_POINTS; iteration++) {
      centuries = startCenturies + (iteration * stepCenturies)
      let elements = OrbitMechanics.getElementsAtCenturiesPastJ2000(this.orbit.keplerianElements, centuries)
      positions.push(OrbitMechanics.getPositionForElements(elements))
    }

    return positions
  }
}
