import {Euler, Quaternion} from 'three'
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
      this.orbit = {}
      this.orbit.keplerianElements = object.orbit.keplerianElements
    }
    this.star = object.star
  }
  setPosition(newPosition) {
    if (typeof(this.position) === 'undefined') {
      this.position = newPosition
    } else {
      this.position.copy(newPosition)
    }
  }

  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let elements = OrbitMechanics.getElementsAtCenturiesPastJ2000(this.orbit.keplerianElements, currentCenturiesPastJ2000)
    let euler1 = new Euler(0, 0, elements.ascendingNodeLongitudeRadians, 'XYZ')
    let quaterion1 = new Quaternion().setFromEuler(euler1)
    let euler2 = new Euler(elements.inclinationRadians, 0, elements.periapsisArgumentRadians, 'XYZ')
    let quaterion2 = new Quaternion().setFromEuler(euler2)
    let planeQuat = new Quaternion().multiplyQuaternions(quaterion1, quaterion2)
    elements.position.applyQuaternion(planeQuat)
    return elements.position
  }
}
