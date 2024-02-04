import { Vector3, Euler, Quaternion } from "three";
import { auToMeters, degreesToRadians, modRadiansToCircle } from "./util";
import { KeplerianElements, KeplerianElementsValues, KeplerianElementsValuesComputed, SolarSystemOrbit } from "./types";
import { ORBIT_POINTS } from "./constants";

// obtains eccentric anomaly from the solution of Kepler's equation:
// i.e find E such that M = E - e* sin(E)
export const getEccentricAnomaly = (eccentricityRadians: number, meanAnomalyRadians: number): number => {
  const maxIterations = 1000;
  const toleranceDegrees = Math.pow(10, -6);
  const eIter = [];
  let deltaE = Infinity;

  // Solving kepler's equation
  // Start with E0 = M + e* sin(M)
  eIter[0] = meanAnomalyRadians + eccentricityRadians * Math.sin(meanAnomalyRadians);

  // Iterate until |delta E| <= tolerance:
  //  delta M = M - (En - e* sin(En)
  //  delta E = delta M / (1 - e sin(En)
  let currentIteration = 0;
  while (Math.abs(deltaE) > toleranceDegrees && currentIteration < maxIterations) {
    const deltaM =
      meanAnomalyRadians - (eIter[currentIteration] - eccentricityRadians * Math.sin(eIter[currentIteration]));
    deltaE = deltaM / (1 - eccentricityRadians * Math.cos(eIter[currentIteration]));
    eIter[currentIteration + 1] = eIter[currentIteration] + deltaE;
    currentIteration += 1;
  }
  const eccentricAnomaly = eIter[currentIteration];
  return eccentricAnomaly;
};

// Adjust from J2000 values
export const getUpdatedElementsAtCenturiesPastJ2000 = (
  keplerianElements: KeplerianElements,
  currentCenturiesPastJ2000: number
) => {
  const updated: KeplerianElementsValues = { ...keplerianElements.initial };
  Object.entries(updated).forEach(([elementKey, elementValue]) => {
    const key = elementKey as keyof KeplerianElementsValues;
    updated[key] = elementValue + keplerianElements.rates[key] * currentCenturiesPastJ2000;
  });
  return updated;
};

// Compute required secondary elements
export const getComputedElements = (elements: KeplerianElementsValues): KeplerianElementsValuesComputed => {
  const computed: Partial<KeplerianElementsValuesComputed> = {};
  computed.periapsisArgumentDegrees = elements.periapsisLongitudeDegrees - elements.ascendingNodeLongitudeDegrees;
  computed.meanAnomalyDegrees = elements.meanLongitudeDegrees - elements.periapsisLongitudeDegrees;

  // Adjust some units
  computed.semiMajorAxisMeters = auToMeters(elements.semiMajorAxisAu);
  computed.inclinationRadians = degreesToRadians(elements.inclinationDegrees);
  computed.ascendingNodeLongitudeRadians = degreesToRadians(elements.ascendingNodeLongitudeDegrees);
  computed.periapsisArgumentRadians = degreesToRadians(computed.periapsisArgumentDegrees);
  computed.meanAnomalyRadians = degreesToRadians(computed.meanAnomalyDegrees);

  // Compute the eccentric anomaly
  computed.eccentricAnomalyRadians = getEccentricAnomaly(elements.eccentricityRadians, computed.meanAnomalyRadians);

  // Mod angles to 2 PI radians
  computed.eccentricAnomalyRadians = modRadiansToCircle(computed.eccentricAnomalyRadians);
  computed.meanAnomalyRadians = modRadiansToCircle(computed.meanAnomalyRadians);

  // for first euler
  computed.ascendingNodeLongitudeRadians = modRadiansToCircle(computed.ascendingNodeLongitudeRadians);
  // for second euler
  computed.inclinationRadians = modRadiansToCircle(computed.inclinationRadians);
  computed.periapsisArgumentRadians = modRadiansToCircle(computed.periapsisArgumentRadians);

  return computed as KeplerianElementsValuesComputed;
};

export const getPositionForElements = (
  elements: KeplerianElementsValues,
  computed: KeplerianElementsValuesComputed
) => {
  const position = new Vector3(
    computed.semiMajorAxisMeters * (Math.cos(computed.eccentricAnomalyRadians) - elements.eccentricityRadians),
    computed.semiMajorAxisMeters *
      Math.sqrt(1 - Math.pow(elements.eccentricityRadians, 2)) *
      Math.sin(computed.eccentricAnomalyRadians),
    0
  );
  const euler1 = new Euler(0, 0, computed.ascendingNodeLongitudeRadians, "XYZ");
  const quaterion1 = new Quaternion().setFromEuler(euler1);
  const euler2 = new Euler(computed.inclinationRadians, 0, computed.periapsisArgumentRadians, "XYZ");
  const quaterion2 = new Quaternion().setFromEuler(euler2);
  const planeQuat = new Quaternion().multiplyQuaternions(quaterion1, quaterion2);
  position.applyQuaternion(planeQuat);
  return position;
};

export const getPositionAtCenturiesPastJ2000 = (
  currentCenturiesPastJ2000: number,
  orbit?: SolarSystemOrbit
): Vector3 => {
  if (!orbit) return new Vector3(0, 0, 0);
  const updated = getUpdatedElementsAtCenturiesPastJ2000(orbit.keplerianElements, currentCenturiesPastJ2000);
  const computed = getComputedElements(updated);
  return getPositionForElements(updated, computed);
};

export const getLastOrbitAtCenturiesPastJ2000 = (
  currentCenturiesPastJ2000: number,
  orbit?: SolarSystemOrbit
): Vector3[] => {
  if (!orbit) return [];

  const positions = [];
  const siderealCenturies = orbit.siderealYears / 100;
  const stepCenturies = siderealCenturies / ORBIT_POINTS;
  const startCenturies = currentCenturiesPastJ2000 - siderealCenturies;

  let centuries;
  for (let iteration = 0; iteration < ORBIT_POINTS; iteration++) {
    centuries = startCenturies + iteration * stepCenturies;
    positions.push(getPositionAtCenturiesPastJ2000(centuries, orbit));
  }

  return positions;
};
