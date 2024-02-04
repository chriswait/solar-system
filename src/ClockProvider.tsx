import React, { useState, useEffect } from "react";

import { getDateAfterNextTick, getJulianDate, getCenturiesPastJ2000 } from "./clock";
import { ClockContext } from "./context";

const ClockProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [clockRateSeconds, setClockRateSeconds] = useState<number>(100);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setDate((currentDate) => getDateAfterNextTick(currentDate, clockRateSeconds));
    }, 40);
    return () => clearInterval(tickInterval);
  }, [clockRateSeconds]);

  return (
    <ClockContext.Provider
      value={{
        currentDate: date,
        julianDate: getJulianDate(date),
        centuriesPastJ2000: getCenturiesPastJ2000(date),
        clockRateSeconds,
        setClockRateSeconds,
      }}
    >
      {children}
    </ClockContext.Provider>
  );
};

export default ClockProvider;
