import {J2000, DAYS_PER_JULIAN_CENTURY, INITIAL_CLOCK_RATE_SECONDS} from './constants'

export class Clock {
  date
  rateSeconds
  constructor() {
    this.date = new Date()
    this.rateSeconds = INITIAL_CLOCK_RATE_SECONDS
  }
  tick() {
    this.date.setTime(this.date.getTime() + (this.rateSeconds * 1000))
  }
  get currentJulianDate() {
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
  get currentCenturiesPastJ2000() {
    return (this.currentJulianDate - J2000) / DAYS_PER_JULIAN_CENTURY
  }
}
