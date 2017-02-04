export function dateToJulianDate(date) {
  let year, month, day, hour, min, sec, a, b, e, julianDate;
  year = date.getFullYear();
  month = date.getMonth()+1;
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  day = date.getUTCDate();
  hour = date.getUTCHours();
  min = date.getUTCMinutes();
  sec = date.getUTCSeconds();

  a = parseInt(year / 100)
  b = 2 - a + parseInt(a / 4)
  e = hour / 24 + min / 1440 + sec / (8.64 * Math.pow(10, 4))

  julianDate = parseInt(365.25 * (year + 4716)) + parseInt(30.6001 * (month + 1)) + day + b - 1524.5 + e

  // correct for dynamical time
  // 2011 : 66.7 seconds. 66.7 / (24 * 3600) = .000771991
  // jd = jd + .000771991

  return julianDate;
}
