import {Clock} from '../src/js/clock';
import * as chai from 'chai';
import chai_datetime from 'chai-datetime';
let expect = chai.expect;
chai.use(chai_datetime);

let now;
let rateSeconds = 1000;
let clock;
describe('clock', function() {
  it('should return the current date', function() {
    now = new Date();
    clock = new Clock(now, rateSeconds);
    expect(clock.date.getTime()).to.equal(now.getTime());
  });
  it('should tick correctly', function() {
    clock = new Clock(new Date(), rateSeconds);
    clock.tick();
    now = new Date();
    let diff = Math.abs(clock.date.getTime() - (now.getTime() + rateSeconds));
    expect(diff).to.be.below(0.1);
  });
  it('should return correct julian date', function() {
    // var testDate = new Date('09/09/2010');
    // var testJulianDate = 2455448.5;
    var testDate = new Date('2017-06-02 00:00');
    var testJulianDate = 2457906.5;
    clock = new Clock(testDate, rateSeconds);
    let julianDate = clock.getCurrentJulianDate();
    let diff = Math.abs(testJulianDate - julianDate);
    expect(diff).to.be.below(0.1);
  });
  it('should return correct centuries past J2000', function() {
    var testDate = new Date('01/01/2000');
    var testCenturies = 0;
    clock = new Clock(testDate, rateSeconds);
    let centuries = clock.getCurrentCenturiesPastJ2000();
    let diff = Math.abs(testCenturies - centuries);
    expect(diff).to.be.below(0.0001);
  });
});
