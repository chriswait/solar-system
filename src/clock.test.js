import {Clock} from './clock'
expect.extend({
  toBeNearMilliseconds(received, argument) {
    let diff = received - argument;
    if (diff < 10) {
      return {
        message: () => `expected ${received} not to be within 10 of ${argument}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be within 10 of ${argument}`,
        pass: false
      }
    }
  }
})

let rateSeconds = 1
let clock
describe('clock', function() {
  beforeEach(function() {
    clock = new Clock()
  })
  it('should return the current date', function() {
    expect(clock.date.getTime()).toBeNearMilliseconds((new Date()).getTime())
  })
  describe('should tick correctly', function() {
    it('10000', function() {
      clock.rateSeconds = 10000
      clock.tick()
      expect(clock.date.getTime()).toBeNearMilliseconds((new Date()).getTime() + 10000 * 1000)
    })
    it('1000000', function() {
      clock.rateSeconds = 1000000
      clock.tick()
      expect(clock.date.getTime()).toBeNearMilliseconds((new Date()).getTime() + 1000000 * 1000)
    })
    it('1000000000', function() {
      clock.rateSeconds = 1000000000
      clock.tick()
      expect(clock.date.getTime()).toBeNearMilliseconds((new Date()).getTime() + 1000000000 * 1000)
    })
  })
  describe('should return the correct julian date', function() {
    beforeEach(function() {
      clock = new Clock()
    })
    it('2001-01-01', function() {
      clock.date = new Date('2001-01-01 00:00')
      expect(clock.currentJulianDate).toBeCloseTo(2451910.5, 0)
    })
    it('2010-09-09', function() {
      clock.date = new Date('2010-09-09 00:00')
      expect(clock.currentJulianDate).toBeCloseTo(2455448.5, 0)
    })
    it('2017-06-02', function() {
      clock.date = new Date('2017-06-02 00:00')
      expect(clock.currentJulianDate).toBeCloseTo(2457906.5, 0)
    })
    it('2100-01-01', function() {
      clock.date = new Date('2100-01-01 00:00')
      expect(clock.currentJulianDate).toBeCloseTo(2488069.5, 0)
    })
  })

  describe('should return correct centuries past J2000', function() {
    beforeEach(function() {
      clock = new Clock()
    })
    it('2000-01-01', function() {
      clock.date = new Date('2000-01-01 00:00')
      expect(clock.currentCenturiesPastJ2000).toBeCloseTo(0, 1)
    })
    it('2100-01-01', function() {
      clock.date = new Date('2100-01-01 00:00')
      expect(clock.currentCenturiesPastJ2000).toBeCloseTo(1, 1)
    })
  })
})
