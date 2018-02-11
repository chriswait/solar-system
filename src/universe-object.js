import {
  Vector3,
  Euler,
  Quaternion
} from 'three'
import {auToMeters, degreesToRadians, modRadiansToCircle} from './util'

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

  static getEccentricAnomaly(eccentricityRadians, meanAnomalyRadians) {
    // obtains eccentric anomaly from the solution of Kepler's equation:
    // i.e find E such that M = E - e* sin(E)
    let eccentricAnomaly
    let eIter, deltaE, deltaM, toleranceDegrees, maxIterations, currentIteration

    maxIterations = 1000
    currentIteration = 0
    toleranceDegrees = Math.pow(10, -6)
    eIter = []
    deltaE = Infinity

    // Solving kepler's equation
    // Start with E0 = M + e* sin(M)
    eIter[0] = meanAnomalyRadians + eccentricityRadians * Math.sin(meanAnomalyRadians)

    // Iterate until |delta E| <= tolerance:
    //  delta M = M - (En - e* sin(En)
    //  delta E = delta M / (1 - e sin(En)
    while (Math.abs(deltaE) > toleranceDegrees && currentIteration < maxIterations) {
      deltaM = meanAnomalyRadians - (eIter[currentIteration] - eccentricityRadians * Math.sin(eIter[currentIteration]))
      deltaE = deltaM / (1 - eccentricityRadians * Math.cos(eIter[currentIteration]))
      eIter[currentIteration+1] = eIter[currentIteration] + deltaE
      currentIteration += 1
    }
    eccentricAnomaly = eIter[currentIteration]
    return eccentricAnomaly
  }

  getElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let elements = {
      time: currentCenturiesPastJ2000
    }

    // Adjust from J2000 values
    // elements courtesy of the JPL: semiMajorAxisAu, eccentricityRadians, inclinationDegrees, meanLongitudeDegrees, periapsisLongitudeDegrees, ascendingNodeLongitudeDegrees
    for (let key in this.orbit.keplerianElements.initial) {
      elements[key] = this.orbit.keplerianElements.initial[key] + (this.orbit.keplerianElements.rates[key] * currentCenturiesPastJ2000)
    }

    // Compute required secondary elements
    elements.periapsisArgumentDegrees = elements.periapsisLongitudeDegrees - elements.ascendingNodeLongitudeDegrees
    elements.meanAnomalyDegrees = elements.meanLongitudeDegrees - elements.periapsisLongitudeDegrees

    // Adjust some units
    elements.semiMajorAxisMeters = auToMeters(elements.semiMajorAxisAu)
    elements.inclinationRadians = degreesToRadians(elements.inclinationDegrees)
    elements.ascendingNodeLongitudeRadians = degreesToRadians(elements.ascendingNodeLongitudeDegrees)
    elements.periapsisArgumentRadians = degreesToRadians(elements.periapsisArgumentDegrees)
    elements.meanAnomalyRadians = degreesToRadians(elements.meanAnomalyDegrees)

    // Compute the eccentric anomaly
    elements.eccentricAnomalyRadians = UniverseObject.getEccentricAnomaly(elements.eccentricityRadians, elements.meanAnomalyRadians)
    // elements.eccentricAnomalyRadians = UniverseObject.solveEccentricAnomaly(elements.eccentricityRadians, elements.meanAnomalyRadians)

    // Mod angles to 2 PI radians
    elements.eccentricAnomalyRadians = modRadiansToCircle(elements.eccentricAnomalyRadians)
    elements.inclinationRadians = modRadiansToCircle(elements.inclinationRadians)
    elements.ascendingNodeLongitudeRadians = modRadiansToCircle(elements.ascendingNodeLongitudeRadians)
    elements.periapsisArgumentRadians = modRadiansToCircle(elements.periapsisArgumentRadians)
    elements.meanAnomalyRadians = modRadiansToCircle(elements.meanAnomalyRadians)

    // Find position
    elements.position = new Vector3(
      elements.semiMajorAxisMeters * (Math.cos(elements.eccentricAnomalyRadians) - elements.eccentricityRadians),
      elements.semiMajorAxisMeters * (Math.sqrt(1 - Math.pow(elements.eccentricityRadians, 2))) * Math.sin(elements.eccentricAnomalyRadians)
    )
    return elements
  }
  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let elements = this.getElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000)
    let euler1 = new Euler(0, 0, elements.ascendingNodeLongitudeRadians, 'XYZ')
    let quaterion1 = new Quaternion().setFromEuler(euler1)
    let euler2 = new Euler(elements.inclinationRadians, 0, elements.periapsisArgumentRadians, 'XYZ')
    let quaterion2 = new Quaternion().setFromEuler(euler2)
    let planeQuat = new Quaternion().multiplyQuaternions(quaterion1, quaterion2)
    elements.position.applyQuaternion(planeQuat)
    return elements.position
  }
}
