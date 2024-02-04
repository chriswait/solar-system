import { J2000, DAYS_PER_JULIAN_CENTURY } from "./constants";

export const getDateAfterNextTick = (date: Date, rateSeconds: number): Date => {
  return new Date(date.getTime() + rateSeconds * 1000);
};

export const getJulianDate = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let julianDate = day + (153 * m + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 32045;

  const hour = date.getUTCHours() - 12;
  const min = date.getUTCMinutes();
  const sec = date.getUTCSeconds();
  const msec = date.getUTCMilliseconds();
  const e = hour / 24 + min / 1440 + sec / 86400 + msec / (86400 * 1000);
  julianDate += e;
  return julianDate;
};

export const getCenturiesPastJ2000 = (date: Date): number => {
  return (getJulianDate(date) - J2000) / DAYS_PER_JULIAN_CENTURY;
};
