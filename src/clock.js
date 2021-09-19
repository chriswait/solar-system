import { J2000, DAYS_PER_JULIAN_CENTURY } from "./constants";

export class Clock {
  static getDateAfterNextTick(date, rateSeconds) {
    return new Date(date.getTime() + rateSeconds * 1000);
  }

  static getJulianDate(date) {
    let year, month, day, hour, min, sec, msec, julianDate;
    year = date.getUTCFullYear();
    month = date.getUTCMonth() + 1;
    day = date.getUTCDate();

    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    julianDate =
      day + (153 * m + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 32045;

    hour = date.getUTCHours() - 12;
    min = date.getUTCMinutes();
    sec = date.getUTCSeconds();
    msec = date.getUTCMilliseconds();
    let e = hour / 24 + min / 1440 + sec / 86400 + msec / (86400 * 1000);
    julianDate += e;
    return julianDate;
  }

  static getCenturiesPastJ2000(date) {
    return (Clock.getJulianDate(date) - J2000) / DAYS_PER_JULIAN_CENTURY;
  }
}
