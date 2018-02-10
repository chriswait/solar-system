import {Clock} from './clock'
// import * as chai from 'chai'
// import chai_datetime from 'chai-datetime'
// let expect = chai.expect
// chai.use(chai_datetime)

let now
let rateSeconds = 1000
let clock
describe('clock', function() {
  it('should return the current date', function() {
    now = new Date()
    clock = new Clock(now, rateSeconds)
    expect(clock.date.getTime()).toEqual(now.getTime())
  })
  describe('should tick correctly', function() {
    it('1', function() {
      clock = new Clock(new Date(), 1)
      clock.tick()
      now = new Date()
      expect(clock.date.getTime()).toBeCloseTo(now.getTime() + 1)
    })
    it('1000', function() {
      clock = new Clock(new Date(), 1000)
      clock.tick()
      now = new Date()
      expect(clock.date.getTime()).toBeCloseTo(now.getTime() + 1000)
    })
    it('1000000', function() {
      clock = new Clock(new Date(), 1000000)
      clock.tick()
      now = new Date()
      expect(clock.date.getTime()).toBeCloseTo(now.getTime() + 1000000)
    })
  })
  describe('should return the correct julian date', function() {
    it('2000-01-01', function() {
      var testDate = new Date('2000-01-01 00:00')
      var testJulianDate = 2451544.5
      clock = new Clock(testDate, rateSeconds)
      expect(clock.getCurrentJulianDate()).toBeCloseTo(testJulianDate, 0)
    })
    it('2010-09-09', function() {
      var testDate = new Date('2010-09-09 00:00')
      var testJulianDate = 2455448.5
      clock = new Clock(testDate, rateSeconds)
      expect(clock.getCurrentJulianDate()).toBeCloseTo(testJulianDate, 0)
    })
    it('2017-06-02', function() {
      var testDate = new Date('2017-06-02 00:00')
      var testJulianDate = 2457906.5
      clock = new Clock(testDate, rateSeconds)
      expect(clock.getCurrentJulianDate()).toBeCloseTo(testJulianDate, 0)
    })
    it('2100-01-01', function() {
      var testDate = new Date('2100-01-01 00:00')
      var testJulianDate = 2488069.5
      clock = new Clock(testDate, rateSeconds)
      expect(clock.getCurrentJulianDate()).toBeCloseTo(testJulianDate, 0)
    })
  })


  describe('should return correct centuries past J2000', function() {
    it('2000-01-01', function() {
      var testDate = new Date('2000-01-01 00:00')
      clock = new Clock(testDate, rateSeconds)
      let centuries = clock.getCurrentCenturiesPastJ2000()
      expect(centuries).toBeCloseTo(0, 1)
    })
    it('2100-01-01', function() {
      var testDate = new Date('2100-01-01 00:00')
      clock = new Clock(testDate, rateSeconds)
      let centuries = clock.getCurrentCenturiesPastJ2000()
      expect(centuries).toBeCloseTo(1, 1)
    })
  })
})
