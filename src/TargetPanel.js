import React from "react";
import { useVisualiser } from "./VisualiserProvider";
import Panel from "./Panel";

const TargetPanel = () => {
  const { currentTargetName, currentTargetPosition } = useVisualiser();
  const displayName =
    currentTargetName[0].toUpperCase() + currentTargetName.substring(1);
  return (
    <div id="target-panel-container" className="panel-container">
      <Panel title={`Target: ${displayName}`}>
        {currentTargetPosition && (
          <div>
            Position
            {["x", "y", "z"].map((key) => (
              <div key={key}>
                {key}: {currentTargetPosition[key].toFixed(3)}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};
export default TargetPanel;
