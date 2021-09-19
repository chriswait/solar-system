import React, { createContext, useContext, useState, useEffect } from "react";

import { Clock } from "./clock";
import { INITIAL_CLOCK_RATE_SECONDS } from "./constants";

const ClockContext = createContext();

const ClockProvider = ({ children }) => {
  const [date, setDate] = useState(new Date());
  const [clockRateSeconds, setClockRateSeconds] = useState(1);

  const tick = (seconds) =>
    setDate((currentDate) => Clock.getDateAfterNextTick(currentDate, seconds));

  useEffect(() => {
    const tickInterval = setInterval(() => {
      tick(clockRateSeconds);
    }, 40);
    return () => {
      clearInterval(tickInterval);
    };
  }, [clockRateSeconds]);

  const value = {
    currentDate: date,
    julianDate: Clock.getJulianDate(date),
    centuriesPastJ2000: Clock.getCenturiesPastJ2000(date),
    clockRateSeconds,
    setClockRateSeconds,
  };

  return (
    <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
  );
};

export const useClock = () => useContext(ClockContext);

export default ClockProvider;
