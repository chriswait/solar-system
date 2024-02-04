import { SolarSystemObjects } from "../src/data/solar-system";
import { ORBIT_POINTS } from "../src/constants";
import { getLastOrbitAtCenturiesPastJ2000, getPositionAtCenturiesPastJ2000 } from "../src/orbit-mechanics";

const sunDictionary = SolarSystemObjects[0];
const earthDictionary = SolarSystemObjects[3];

describe("should load objects correctly", function () {
  it("earth", function () {
    const universeObject = earthDictionary;
    expect(universeObject.name).toBe("earth");
    expect(universeObject.orbit).toBeDefined();
    expect(universeObject.star).toBeFalsy();
  });
  it("sun", function () {
    const universeObject = sunDictionary;
    expect(universeObject.name).toBe("sun");
    expect(universeObject.orbit).toBeUndefined();
    expect(universeObject.star).toBeTruthy();
  });
});
describe("should return position at centuries", function () {
  it("earth at J2000", function () {
    const position = getPositionAtCenturiesPastJ2000(0, earthDictionary.orbit);
    expect(typeof position).toEqual("object");
    expect(typeof position.x).toEqual("number");
  });
  it("sun", function () {
    const position = getPositionAtCenturiesPastJ2000(0, sunDictionary.orbit);
    expect(typeof position).toEqual("object");
    expect(typeof position.x).toEqual("number");
    expect(position.x).toEqual(0);
  });
});

describe("should return last orbit at centuries", function () {
  it("earth at J2000", function () {
    const positions = getLastOrbitAtCenturiesPastJ2000(1, earthDictionary.orbit);
    expect(positions.length === ORBIT_POINTS).toBeTruthy();
    expect(Array.isArray(positions)).toBeTruthy();
    expect(typeof positions[0].x).toEqual("number");
  });
});
