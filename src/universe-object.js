import {Vector3} from 'three'
import {OrbitMechanics} from './orbit-mechanics'

export class UniverseObject {
  name
  radius
  color
  orbit
  star
  mesh
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
    let position
    if (!this.orbit) {
      position = new Vector3(0, 0, 0)
    } else {
      let elements = OrbitMechanics.getElementsAtCenturiesPastJ2000(this.orbit.keplerianElements, currentCenturiesPastJ2000)
      position = OrbitMechanics.getPositionForElements(elements)
    }
    return position
  }
}
