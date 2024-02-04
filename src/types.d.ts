export type KeplerianElementsValues = {
  semiMajorAxisAu: number;
  eccentricityRadians: number;
  inclinationDegrees: number;
  meanLongitudeDegrees: number;
  periapsisLongitudeDegrees: number;
  ascendingNodeLongitudeDegrees: number;
};

export type KeplerianElementsValuesComputed = {
  periapsisArgumentDegrees: number;
  meanAnomalyDegrees: number;
  semiMajorAxisMeters: number;
  inclinationRadians: number;
  ascendingNodeLongitudeRadians: number;
  periapsisArgumentRadians: number;
  meanAnomalyRadians: number;
  eccentricAnomalyRadians: number;
  meanAnomalyRadians: number;
  ascendingNodeLongitudeRadians: number;
  inclinationRadians: number;
  periapsisArgumentRadians: number;
};

export type KeplerianElements = {
  initial: KeplerianElementsValues;
  rates: KeplerianElementsValues;
};

export type SolarSystemOrbit = {
  siderealYears: number;
  keplerianElements: KeplerianElements;
};

export type SolarSystemObject = {
  name: string;
  radius: number;
  color: string;
  map: string;
  star?: object;
  orbit?: SolarSystemOrbit;
  position?: Vector3;
  lastOrbit: Vector3[];
};

export type VisualiserObject = SolarSystemObject & {
  radius3d: number;
  orbitPoints3d: Vector3[];
  position3d: Vector3;
};
