import { getDateAfterNextTick, getJulianDate, getCenturiesPastJ2000 } from "../src/clock";

expect.extend({
  toBeNearMilliseconds(received, argument) {
    const diff = received - argument;
    if (diff < 10) {
      return {
        message: () => `expected ${received} not to be within 10 of ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within 10 of ${argument}`,
        pass: false,
      };
    }
  },
});

describe("should compute date of next tick", function () {
  it("with rate of 0 seconds", function () {
    const date = new Date();
    expect(getDateAfterNextTick(date, 0).getTime()).toBe(date.getTime());
  });
  it("with rate of 1 seconds", function () {
    const date = new Date();
    expect(getDateAfterNextTick(date, 1).getTime()).toBe(date.getTime() + 1 * 1000);
  });
  it("with rate of 1000 seconds", function () {
    const date = new Date();
    expect(getDateAfterNextTick(date, 1000).getTime()).toBe(date.getTime() + 1000 * 1000);
  });
});

describe("should return the correct julian date", function () {
  it("2001-01-01", function () {
    const date = new Date("2001-01-01 00:00");
    expect(getJulianDate(date)).toBeCloseTo(2451910.5, 0);
  });
  it("2010-09-09", function () {
    const date = new Date("2010-09-09 00:00");
    expect(getJulianDate(date)).toBeCloseTo(2455448.5, 0);
  });
  it("2017-06-02", function () {
    const date = new Date("2017-06-02 00:00");
    expect(getJulianDate(date)).toBeCloseTo(2457906.5, 0);
  });
  it("2100-01-01", function () {
    const date = new Date("2100-01-01 00:00");
    expect(getJulianDate(date)).toBeCloseTo(2488069.5, 0);
  });
});

describe("should return correct centuries past J2000", function () {
  it("2000-01-01", function () {
    const date = new Date("2000-01-01 00:00");
    expect(getCenturiesPastJ2000(date)).toBeCloseTo(0, 1);
  });
  it("2100-01-01", function () {
    const date = new Date("2100-01-01 00:00");
    expect(getCenturiesPastJ2000(date)).toBeCloseTo(1, 1);
  });
});
