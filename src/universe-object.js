import {
  Vector3,
  Euler,
  Quaternion
} from 'three'
import {Util} from './util'


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

  // getEccentricAnomaly2(eccentricityRadians, meanAnomalyRadians) {
  //   var solveKepler = function(e, M) {
  //     return function(x) {
  //       return x + (M + e * Math.sin(x) - x) / (1 - e * Math.cos(x))
  //     }
  //   }

  //   var solveKeplerLaguerreConway = function(e, M) {
  //     return function(x) {
  //       var s = e * Math.sin(x)
  //       var c = e * Math.cos(x)
  //       var f = x - s - M
  //       var f1 = 1 - c
  //       var f2 = s

  //       x += -5 * f / (f1 + CMath.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)))
  //       return x
  //     }
  //   }

  //   var solveKeplerLaguerreConwayHyp = function(e, M) {
  //     return function(x) {
  //       var s = e * CMath.sinh(x)
  //       var c = e * CMath.cosh(x)
  //       var f = x - s - M
  //       var f1 = c - 1
  //       var f2 = s

  //       x += -5 * f / (f1 + CMath.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)))
  //       return x
  //     }
  //   }

  //   if (e == 0.0) {
  //     return M
  //   }  else if (e < 0.9) {
  //     var sol = solveEccentricAnomaly(solveKepler(e, M), M, 6)
  //     return sol
  //   } else if (e < 1.0) {
  //     var E = M + 0.85 * e * ((Math.sin(M) >= 0.0) ? 1 : -1)
  //     var sol = solveEccentricAnomaly(solveKeplerLaguerreConway(e, M), E, 8)
  //     return sol
  //   } else if (e == 1.0) {
  //     return M
  //   } else {
  //     var E = Math.log(2 * M / e + 1.85)
  //     var sol = solveEccentricAnomaly(solveKeplerLaguerreConwayHyp(e, M), E, 30)
  //     return sol
  //   }
  // }

  getEccentricAnomaly(eccentricityRadians, meanAnomalyRadians) {
    // obtains eccentric anomaly from the solution of Kepler's equation:
    // i.e find E such that M = E - e* sin(E)
    let eccentricAnomaly
    let eccentricityDegrees, eIter, deltaE, deltaM, toleranceDegrees, maxIterations, currentIteration

    maxIterations = 1000
    currentIteration = 0
    toleranceDegrees = Math.pow(10, -6)

    eccentricityDegrees = (eccentricityRadians * (180 / Math.PI))
    eIter = []
    deltaE = Infinity

    // Solving kepler's equation
    // Start with E0 = M + e* sin(M)
    eIter[0] = meanAnomalyRadians + eccentricityDegrees * Math.sin(meanAnomalyRadians)

    // Iterate until |delta E| <= tolerance:
    //  delta M = M - (En - e* sin(En)
    //  delta E = delta M / (1 - e sin(En)
    while (Math.abs(deltaE) > toleranceDegrees && currentIteration < maxIterations) {
      deltaM = meanAnomalyRadians - (eIter[currentIteration] - eccentricityDegrees * Math.sin(eIter[currentIteration]))
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
    elements.semiMajorAxisMeters = Util.auToMeters(elements.semiMajorAxisAu)
    elements.inclinationRadians = Util.degreesToRadians(elements.inclinationDegrees)
    elements.ascendingNodeLongitudeRadians = Util.degreesToRadians(elements.ascendingNodeLongitudeDegrees)
    elements.periapsisArgumentRadians = Util.degreesToRadians(elements.periapsisArgumentDegrees)
    elements.meanAnomalyRadians = Util.degreesToRadians(elements.meanAnomalyDegrees)

    // Compute the eccentric anomaly
    elements.eccentricAnomalyRadians = this.getEccentricAnomaly(elements.eccentricityRadians, elements.meanAnomalyRadians)

    // Mod angles to 2 PI radians
    elements.eccentricAnomalyRadians = Util.modRadiansToCircle(elements.eccentricAnomalyRadians)
    elements.inclinationRadians = Util.modRadiansToCircle(elements.inclinationRadians)
    elements.ascendingNodeLongitudeRadians = Util.modRadiansToCircle(elements.ascendingNodeLongitudeRadians)
    elements.periapsisArgumentRadians = Util.modRadiansToCircle(elements.periapsisArgumentRadians)
    elements.meanAnomalyRadians = Util.modRadiansToCircle(elements.meanAnomalyRadians)

    // Find position
    elements.position = new Vector3(
      elements.semiMajorAxisMeters * (Math.cos(elements.eccentricAnomalyRadians) - elements.eccentricityRadians),
      elements.semiMajorAxisMeters * (Math.sqrt(1 - (elements.eccentricityRadians * elements.eccentricityRadians))) * Math.sin(elements.eccentricAnomalyRadians)
    )
    elements.radius = elements.position.length()
    // elements.v = Math.atan2(elements.position.y, elements.position.x)
    return elements
  }
  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let elements = this.getElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000)
    let euler1 = new Euler(elements.tilt || 0, 0, elements.ascendingNodeLongitudeRadians, 'XYZ')
    let quaterion1 = new Quaternion().setFromEuler(euler1)
    let euler2 = new Euler(elements.inclinationRadians, 0, elements.periapsisArgumentRadians, 'XYZ')
    let quaterion2 = new Quaternion().setFromEuler(euler2)
    let planeQuat = new Quaternion().multiplyQuaternions(quaterion1, quaterion2)
    elements.position.applyQuaternion(planeQuat)
    return elements.position
  }
}
