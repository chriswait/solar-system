import {auToMeters, degreesToRadians, modRadiansToCircle, radiansToDegrees} from './util'

describe('util', function() {
  describe('can convert au to meters', function() {
    it('10au', function() {
      expect(auToMeters(10)).toEqual(1495978707000)
    })
  })
  describe('can convert degrees to radians', function() {
    it('0 deg', function() {
      expect(degreesToRadians(0)).toBeCloseTo(0)
    })
    it('180 deg', function() {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    })
    it('-90 deg', function() {
      expect(degreesToRadians(-90)).toBeCloseTo(-(Math.PI/2))
    })
  })
  describe('can convert radians to degrees', function() {
    it('0 rad', function() {
      expect(radiansToDegrees(0)).toBeCloseTo(0)
    })
    it('pi radians', function() {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180)
    })
    it('5 radians', function() {
      expect(radiansToDegrees(5)).toBeCloseTo(286.479)
    })
  })
  describe('can mod radian values within a circle', function() {
    it('1 rad', function() {
      expect(modRadiansToCircle(1)).toEqual(1)
    })
    it('-1 rad', function() {
      expect(modRadiansToCircle(-1)).toEqual(Math.PI * 2 - 1)
    })
    it('2*pi + 1 rad', function() {
      expect(modRadiansToCircle(Math.PI * 2 + 1)).toEqual(1)
    })
    it('3*pi rad', function() {
      expect(modRadiansToCircle(Math.PI * 3)).toEqual(Math.PI)
    })
  })
})