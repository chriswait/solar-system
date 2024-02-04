import { SolarSystemObjects } from "../src/data/solar-system";
import {
  getComputedElements,
  getEccentricAnomaly,
  getUpdatedElementsAtCenturiesPastJ2000,
} from "../src/orbit-mechanics";
import { degreesToRadians } from "../src/util";

describe("can solve eccentric anomaly", function () {
  it("e=0.5, M=27 deg", function () {
    expect(getEccentricAnomaly(0.5, degreesToRadians(27))).toBeCloseTo(degreesToRadians(48.43418));
  });
  it("e=1.0, M=90 deg", function () {
    expect(getEccentricAnomaly(1, degreesToRadians(90))).toBeCloseTo(degreesToRadians(132.34646));
  });
  it("e=0.1, M=180 deg", function () {
    expect(getEccentricAnomaly(0.1, degreesToRadians(180))).toBeCloseTo(degreesToRadians(180));
  });
});

const earth = SolarSystemObjects[3];

describe("can get elements at date", function () {
  it("earth at J2000", function () {
    const keplerianElements = earth.orbit!.keplerianElements;
    const newElements = getUpdatedElementsAtCenturiesPastJ2000(keplerianElements, 0);
    const computed = getComputedElements(newElements);

    // 6 orbital parameters should be unchanged
    expect(newElements.semiMajorAxisAu).toBe(keplerianElements.initial.semiMajorAxisAu);
    expect(newElements.eccentricityRadians).toBe(keplerianElements.initial.eccentricityRadians);
    expect(newElements.inclinationDegrees).toBe(keplerianElements.initial.inclinationDegrees);
    expect(newElements.meanLongitudeDegrees).toBe(keplerianElements.initial.meanLongitudeDegrees);
    expect(newElements.periapsisLongitudeDegrees).toBe(keplerianElements.initial.periapsisLongitudeDegrees);
    expect(newElements.ascendingNodeLongitudeDegrees).toBe(keplerianElements.initial.ascendingNodeLongitudeDegrees);
    expect(computed.eccentricAnomalyRadians).toBe(6.239288048592674);
    expect(computed.meanAnomalyRadians).toBe(6.2400213902032);
    expect(computed.ascendingNodeLongitudeRadians).toBe(0);
    expect(computed.inclinationRadians).toBe(6.283185039969678);
    expect(computed.periapsisArgumentRadians).toBe(1.7966014740491711);
  });
  it("earth at J2100", function () {
    const keplerianElements = SolarSystemObjects[3].orbit!.keplerianElements;
    const newElements = getUpdatedElementsAtCenturiesPastJ2000(keplerianElements, 1);
    const computed = getComputedElements(newElements);

    // 6 orbital parameters should have increased by their rates
    expect(newElements.semiMajorAxisAu).toBe(
      keplerianElements.initial.semiMajorAxisAu + keplerianElements.rates.semiMajorAxisAu
    );
    expect(newElements.eccentricityRadians).toBe(
      keplerianElements.initial.eccentricityRadians + keplerianElements.rates.eccentricityRadians
    );
    expect(newElements.inclinationDegrees).toBe(
      keplerianElements.initial.inclinationDegrees + keplerianElements.rates.inclinationDegrees
    );
    expect(newElements.meanLongitudeDegrees).toBe(
      keplerianElements.initial.meanLongitudeDegrees + keplerianElements.rates.meanLongitudeDegrees
    );
    expect(newElements.periapsisLongitudeDegrees).toBe(
      keplerianElements.initial.periapsisLongitudeDegrees + keplerianElements.rates.periapsisLongitudeDegrees
    );
    expect(newElements.ascendingNodeLongitudeDegrees).toBe(
      keplerianElements.initial.ascendingNodeLongitudeDegrees + keplerianElements.rates.ascendingNodeLongitudeDegrees
    );
    expect(computed.eccentricAnomalyRadians).toBe(6.222414114804273);
    expect(computed.meanAnomalyRadians).toBe(6.2234263837632895);
    expect(computed.ascendingNodeLongitudeRadians).toBe(0);
    expect(computed.inclinationRadians).toBe(6.282959077776476);
    expect(computed.periapsisArgumentRadians).toBe(1.8022436634520778);
  });
});
