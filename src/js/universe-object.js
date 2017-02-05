import {
  Vector3,
} from 'three';


export class UniverseObject {
  name;
  radius;
  color;
  orbit;
  star;

  mesh;
  currentPosition;
  constructor(object) {
    this.name = object.name;
    this.radius = object.radius;
    this.color = object.color;
    if (object.orbit) {
      this.orbit = {};
      this.orbit.radius = object.orbit.radius;
      this.orbit.keplerianElements = object.orbit.keplerianElements;
    }
    this.star = object.star;
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
    let meanAnomalyMod = (meanAnomaly % 360);
    if (meanAnomalyMod < 0) {
      meanAnomalyMod += 360;
    }
    return meanAnomalyMod;
  }
  EccAnom(eccentricityRadians,meanAnomalyMod,dp) {
    // eccentricityRadians=eccentricity, meanAnomalyMod=mean anomaly,
    // dp=number of decimal places
    var pi=Math.PI, K=pi/180.0;
    var maxIter=30, i=0;
    var delta=Math.pow(10,-dp);
    var E, F;
    meanAnomalyMod=meanAnomalyMod/360.0;
    meanAnomalyMod=2.0*pi*(meanAnomalyMod-Math.floor(meanAnomalyMod));
    if (eccentricityRadians<0.8) E=meanAnomalyMod; else E=pi;
    F = E - eccentricityRadians*Math.sin(meanAnomalyMod) - meanAnomalyMod;
    while ((Math.abs(F)>delta) && (i<maxIter)) {
      E = E - F/(1.0-eccentricityRadians*Math.cos(E));
      F = E - eccentricityRadians*Math.sin(E) - meanAnomalyMod;
      i = i + 1;
    }
    E=E/K;
    return Math.round(E*Math.pow(10,dp))/Math.pow(10,dp);
  }
  getEccentricAnomaly(eccentricityRadians, meanAnomalyMod) {
    // obtains eccentric anomaly from the solution of Kepler's equation:
    // i.e find E such that M = E - e* sin(E)
    let eccentricAnomaly;
    let eccentricityDegrees, eIter, deltaE, deltaM, toleranceDegrees, maxIterations, currentIteration;

    maxIterations = 1000;
    currentIteration = 0;
    toleranceDegrees = Math.pow(10, -6);

    eccentricityDegrees = (eccentricityRadians * (180 / Math.PI));
    eIter = [];
    deltaE = Infinity;

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
  getKeplerianElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let currentElements = {};
    for (let key in this.orbit.keplerianElements.initial) {
      currentElements[key] = this.orbit.keplerianElements.initial[key] + (this.orbit.keplerianElements.rates[key] * currentCenturiesPastJ2000);
    }
    currentElements.argumentOfPerihelion = this.getArgumentOfPerihelion(currentElements.perihelionLongitudeDegrees, currentElements.ascendingNodeLongitudeDegrees);
    currentElements.meanAnomalyMod = this.getMeanAnomaly(currentElements.meanLongitudeDegrees, currentElements.perihelionLongitudeDegrees);
    currentElements.eccentricAnomalyDegrees = this.getEccentricAnomaly(currentElements.eccentricityRadians, currentElements.meanAnomalyMod);
    return currentElements;
  }
  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let currentElements, x, y, z, position;
    currentElements = this.getKeplerianElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000);
    x = 0;
    y = 0;
    z = 0;
    position = new Vector3(x, y, z);
    return position;
  }
  getPositionAtT(t) {
    let x, y, z;
    let position;
    if (this.star) {
      x = 0;
      z = 0;
    } else {
      x = this.orbit.radius * Math.cos(t);
      z = this.orbit.radius * Math.sin(t);
    }
    y = 0;
    position = new Vector3(x, y, z);
    return position;
  }
}
