const J2000 = 2451545.0
const DAYS_PER_JULIAN_CENTURY = 36525

export class Clock {
  date
  rateSeconds
  constructor(initialDate, rateSeconds) {
    this.date = initialDate
    this.rateSeconds = rateSeconds
  }
  tick() {
    this.date.setTime(this.date.getTime() + (this.rateSeconds * 1000))
  }
  getCurrentJulianDate() {
    let year, month, day, hour, min, sec, julianDate
    year = this.date.getUTCFullYear()
    month = this.date.getUTCMonth() + 1
    day = this.date.getUTCDate()

    let a = Math.floor((14 - month) / 12)
    let y = year + 4800 - a
    let m = month + (12 * a) - 3
    julianDate = day + (((153 * m) + 2) / 5) + (365 * y) + (y / 4) - (y / 100) + (y / 400) - 32045

    hour = (this.date.getUTCHours() - 12)
    min = this.date.getUTCMinutes()
    sec = this.date.getUTCSeconds()
    let e = (hour / 24) + (min / 1440) + (sec / 86400)
    julianDate += e
    return julianDate
  }
  getCurrentCenturiesPastJ2000() {
    return (this.getCurrentJulianDate() - J2000) / DAYS_PER_JULIAN_CENTURY
  }
}
