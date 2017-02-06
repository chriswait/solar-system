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
  EccAnom(eccentricityRadians,meanAnomalyMod) {
    // eccentricityRadians=eccentricity, meanAnomalyMod=mean anomaly,
    // dp=number of decimal places
    var dp = 6;
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
    // currentElements.eccentricAnomalyDegrees = this.getEccentricAnomaly(currentElements.eccentricityRadians, currentElements.meanAnomalyMod);
    currentElements.eccentricAnomalyDegrees = this.EccAnom(currentElements.eccentricityRadians, currentElements.meanAnomalyMod);
    return currentElements;
  }
  getHeliocentricCoordinatesFromElements(elements) {
    let x, y, z, heliocentricCoordinates;
    x = elements.semiMajorAxisAu * (Math.cos(elements.eccentricAnomalyDegrees) - elements.eccentricityRadians);
    y = elements.semiMajorAxisAu * Math.sqrt(1 - Math.pow(elements.eccentricityRadians, 2));
    z = 0;
    heliocentricCoordinates = new Vector3(x, y, z);
    return heliocentricCoordinates;
  }
  getEclipticCoordinatesFromHeliocentricCoordinates(elements, heliocentricCoordinates) {
    let x, y, z, eclipticCoordinates;
    let cosPerihelion = Math.cos(elements.perihelionLongitudeDegrees);
    let sinPerihelion = Math.sin(elements.perihelionLongitudeDegrees);
    let cosAscending = Math.cos(elements.ascendingNodeLongitudeDegrees);
    let sinAscending = Math.sin(elements.ascendingNodeLongitudeDegrees);
    let cosInclination = Math.cos(elements.inclinationDegrees);
    let sinInclination = Math.sin(elements.inclinationDegrees);

    x = (
      (cosPerihelion * cosAscending) - (sinPerihelion * sinAscending * cosInclination) * heliocentricCoordinates.x
    ) + (
      (-sinPerihelion * cosAscending) - (cosPerihelion * sinAscending * cosInclination) * heliocentricCoordinates.y
    );

    y = (
      (cosPerihelion * sinAscending) + (sinPerihelion * cosAscending * cosInclination) * heliocentricCoordinates.x
    ) + (
      (-sinPerihelion * sinAscending) + (cosPerihelion * cosAscending * cosInclination) * heliocentricCoordinates.y
    );

    z = (
      (sinPerihelion * sinInclination) *  heliocentricCoordinates.x
    ) + (
      (cosPerihelion * sinInclination) * heliocentricCoordinates.y
    );

    eclipticCoordinates = new Vector3(x, y, z);
    return eclipticCoordinates;
  }
  getJ2000CoordinatesFromEclipticCoordinates(currentElements, eclipticCoordinates) {
    let x, y, z, j2000Coordinates;
    let obliquity = 23.43928;
    let sinOb = Math.sin(obliquity);
    let cosOb = Math.cos(obliquity);
    x = eclipticCoordinates.x;
    y = (cosOb * eclipticCoordinates.y) - (sinOb * eclipticCoordinates.z);
    z = (sinOb * eclipticCoordinates.y) + (cosOb * eclipticCoordinates.z);
    j2000Coordinates =  new Vector3(x, y, z);
    return j2000Coordinates;
  }
  getPositionAtCenturiesPastJ2000(currentCenturiesPastJ2000) {
    let currentElements, heliocentricCoordinates, eclipticCoordinates, j2000Coordinates, x, y, z, position;
    if (this.star) {
      x = 0;
      z = 0;
      z = 0;
    } else {
      currentElements = this.getKeplerianElementsAtCenturiesPastJ2000(currentCenturiesPastJ2000);
      heliocentricCoordinates = this.getHeliocentricCoordinatesFromElements(currentElements);
      eclipticCoordinates = this.getEclipticCoordinatesFromHeliocentricCoordinates(currentElements, heliocentricCoordinates);
      j2000Coordinates = this.getJ2000CoordinatesFromEclipticCoordinates(currentElements, eclipticCoordinates);
      x = j2000Coordinates.x * this.orbit.radius;
      y = j2000Coordinates.y * this.orbit.radius;
      z = j2000Coordinates.z * this.orbit.radius;
    }
    position = new Vector3(x, y, z);
    return position;
  }
}
