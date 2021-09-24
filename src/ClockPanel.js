import React from "react";
import { useClock } from "./ClockProvider";
import Panel from "./Panel";

const ClockPanel = () => {
  const {
    currentDate,
    julianDate,
    centuriesPastJ2000,
    clockRateSeconds,
    setClockRateSeconds,
  } = useClock();
  return (
    <div id="clock-control-container" className="panel-container">
      <Panel title="Clock" reverse>
        <div className="row">
          <label htmlFor="clock-rate-seconds">Clock Rate (s):</label>
          <input
            id="clock-rate-seconds"
            value={clockRateSeconds}
            onChange={(event) => setClockRateSeconds(event.target.value)}
          />
        </div>
        <div className="row">
          <div>Date:</div>
          <div>{currentDate.toISOString().split("T")[0]}</div>
        </div>
        <div className="row">
          <div>Julian Date:</div>
          <div>{julianDate.toFixed(3)}</div>
        </div>
        <div className="row">
          <div>Centuries Past J2000:</div>
          <div>{centuriesPastJ2000.toFixed(3)}</div>
        </div>
      </Panel>
    </div>
  );
};

export default ClockPanel;
