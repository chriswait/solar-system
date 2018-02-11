import {UniverseObject} from './universe-object'
// import SolarSystemData from './data/solar-system.json'
import {degreesToRadians} from './util'

// let universeObject = new UniverseObject(SolarSystemData.objects[3])
// console.log(universeObject)

describe('universe-object', function() {
  describe('can solve eccentric anomaly', function() {
    it ('e=0.5, M=27 deg', function() {
      expect(
        UniverseObject.getEccentricAnomaly(0.5, degreesToRadians(27))
      ).toBeCloseTo(
        degreesToRadians(48.43418)
      );
    })
    it ('e=1.0, M=90 deg', function() {
      expect(
        UniverseObject.getEccentricAnomaly(1, degreesToRadians(90))
      ).toBeCloseTo(
        degreesToRadians(132.34646)
      );
    })
    it ('e=0.1, M=180 deg', function() {
      expect(
        UniverseObject.getEccentricAnomaly(0.1, degreesToRadians(180))
      ).toBeCloseTo(
        degreesToRadians(180)
      );
    })
  })
})