const J2000 = 2451545.0;
const DAYS_PER_JULIAN_CENTURY = 36525;

export class Clock {
  date;
  rateMilliseconds;
  constructor(initialDate, rateMilliseconds) {
    this.date = initialDate;
    this.rateMilliseconds = rateMilliseconds;
  }
  tick() {
    // this.date.setMilliseconds(this.date.getMilliseconds() + this.rateMilliseconds);
    this.date.setSeconds(this.date.getSeconds() + this.rateMilliseconds);
  }
  getCurrentJulianEphemerisDate() {
    let year, month, day, hour, min, sec, a, b, e, julianEphemerisDate;
    year = this.date.getFullYear();
    month = this.date.getMonth()+1;
    day = this.date.getUTCDate();
    hour = this.date.getUTCHours();
    min = this.date.getUTCMinutes();
    sec = this.date.getUTCSeconds();
    if (month < 3) {
      month += 12;
      year -= 1;
    }
    a = parseInt(year / 100)
    b = 2 - a + parseInt(a / 4)
    e = hour / 24 + min / 1440 + sec / (8.64 * Math.pow(10, 4))
    julianEphemerisDate = parseInt(365.25 * (year + 4716)) + parseInt(30.6001 * (month + 1)) + day + b - 1524.5 + e
    // correct for dynamical date
    // 2011 : 66.7 seconds. 66.7 / (24 * 3600) = .000771991
    // jd = jd + .000771991
    return julianEphemerisDate;
  }
  getCurrentCenturiesPastJ2000() {
    return (this.getCurrentJulianEphemerisDate() - J2000) / DAYS_PER_JULIAN_CENTURY;
  }
}
