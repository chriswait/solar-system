import {OrbitMechanics} from './orbit-mechanics'
import {degreesToRadians} from './util'

describe('can solve eccentric anomaly', function() {
    it ('e=0.5, M=27 deg', function() {
      expect(
        OrbitMechanics.getEccentricAnomaly(0.5, degreesToRadians(27))
      ).toBeCloseTo(
        degreesToRadians(48.43418)
      );
    })
    it ('e=1.0, M=90 deg', function() {
      expect(
        OrbitMechanics.getEccentricAnomaly(1, degreesToRadians(90))
      ).toBeCloseTo(
        degreesToRadians(132.34646)
      );
    })
    it ('e=0.1, M=180 deg', function() {
      expect(
        OrbitMechanics.getEccentricAnomaly(0.1, degreesToRadians(180))
      ).toBeCloseTo(
        degreesToRadians(180)
      );
    })
  })