import React from "react";
import { useClock } from "./ClockProvider";
import { useSolarSystem } from "./SolarSystemProvider";

const ControlPanel = () => {
  const {
    currentDate,
    julianDate,
    centuriesPastJ2000,
    clockRateSeconds,
    setClockRateSeconds,
  } = useClock();
  const {
    cameraPosition,
    currentTargetName,
    currentTargetPosition,
    objects,
    setTargetName,
  } = useSolarSystem();
  return (
    <div id="control-panel">
      <div id="control-panel-content">
        <h1>Controls</h1>
        <div className="panel">
          <h2>Clock</h2>
          <div>date: {currentDate.toString()}</div>
          <div>julian: {julianDate}</div>
          <div>centuries past J2000: {centuriesPastJ2000}</div>
          <div>
            Clock Speed:{" "}
            <input
              value={clockRateSeconds}
              onChange={(event) => setClockRateSeconds(event.target.value)}
            />
          </div>
        </div>
        <div className="panel">
          <h2>Camera</h2>
          {cameraPosition && (
            <div>
              <h3>cameraPosition</h3>
              <div>x: {cameraPosition.x}</div>
              <div>y: {cameraPosition.y}</div>
              <div>z: {cameraPosition.z}</div>
            </div>
          )}
        </div>
        <div className="panel">
          <h3>target</h3>
          {currentTargetName && <div>{currentTargetName}</div>}
          {currentTargetPosition && (
            <div>
              <div>x: {currentTargetPosition.x}</div>
              <div>y: {currentTargetPosition.y}</div>
              <div>z: {currentTargetPosition.z}</div>
            </div>
          )}
        </div>
        <div className="panel">
          <h2>Objects</h2>
          {objects.map((object) => (
            <div key={object.name}>
              <span
                className="{selected: object.name === currentTargetName}"
                onClick={() => setTargetName(object.name)}
              >
                {object.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ControlPanel;
