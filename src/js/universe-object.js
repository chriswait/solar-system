import {
  Vector3,
} from 'three';

export class UniverseObject {
  name;
  radius;
  color;
  orbit;
  orbits;
  mesh;
  currentPosition;
  constructor(object) {
    for (let key of Object.keys(object)) {
      if (object[key]) {
        this[key] = object[key];
      }
    }
  }
  setCurrentPosition(newPosition) {
    if (typeof(this.currentPosition) === 'undefined') {
      this.currentPosition = newPosition;
    } else {
      this.currentPosition.copy(newPosition);
    }
  }
  getArgumentOfPerihelion(perihelionLongitudeDegrees, ascendingNodeLongitudeDegrees) {
    let argumentOfPerihelion = perihelionLongitudeDegrees - ascendingNodeLongitudeDegrees;
    return argumentOfPerihelion;
  }
  getMeanAnomaly(meanLongitudeDegrees, perihelionLongitudeDegrees) {
    let meanAnomaly = meanLongitudeDegrees - perihelionLongitudeDegrees;
    let meanAnomalyMod = (meanAnomaly % 360) - 180;
    return meanAnomalyMod;
  }
  getEccentricAnomaly(meanAnomalyMod, eccentricityRadians) {
    // obtains eccentric anomaly from the solution of Kepler's equation:
    // i.e find E such that M = E - e* sin(E)
    let eccentricAnomaly;
    let eccentricityDegrees, eIter, deltaE, deltaM, toleranceDegrees, currentIteration;
    let maxIterations = 100;

    eccentricityDegrees = (eccentricityRadians * (180 / Math.PI));
    toleranceDegrees = Math.pow(10, -6);
    eIter = [];
    deltaE = Infinity;
    currentIteration = 0;

    // Solving kepler's equation
    // Start with E0 = M + e* sin(M)
    eIter[0] = meanAnomalyMod + eccentricityDegrees * Math.sin(meanAnomalyMod);

    // Iterate until |delta E| <= tolerance:
    //  delta M = M - (En - e* sin(En)
    //  delta E = delta M / (1 - e sin(En)
    while (Math.abs(deltaE) > toleranceDegrees && currentIteration < maxIterations) {
      deltaM = meanAnomalyMod - (eIter[currentIteration] - eccentricityDegrees * Math.sin(eIter[currentIteration]));
      deltaE = deltaM / (1 - eccentricityRadians * Math.cos(eIter[currentIteration]));
      eIter[currentIteration+1] = eIter[currentIteration] + deltaE;
      currentIteration += 1;
    }
    eccentricAnomaly = eIter[currentIteration];
    return eccentricAnomaly;
  }
  getCurrentKeplerianElements(currentCenturiesPastJ2000) {
    let currentElements = {};
    for (let key in this.orbit.keplerianElements.initial) {
      currentElements[key] = this.orbit.keplerianElements.initial[key] + (this.orbit.keplerianElements.rates[key] * currentCenturiesPastJ2000);
    }
    currentElements.argumentOfPerihelion = this.getArgumentOfPerihelion(currentElements.perihelionLongitudeDegrees, currentElements.ascendingNodeLongitudeDegrees);
    currentElements.meanAnomalyMod = this.getMeanAnomaly(currentElements.meanLongitudeDegrees, currentElements.perihelionLongitudeDegrees);
    currentElements.eccentricAnomaly = this.getEccentricAnomaly(currentElements.meanAnomalyMod, currentElements.eccentricityRadians);
    return currentElements;
  }
  getPositionAtDate(date) {
    // TODO - replace this with actual logic
    let x, y, z;
    let position;
    x = this.orbit.radius * Math.cos(date);
    z = this.orbit.radius * Math.sin(date);
    y = 0;
    position = new Vector3(x, y, z);
    return position;
  }
}
