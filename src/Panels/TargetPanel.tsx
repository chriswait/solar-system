import { useVisualiser } from "../context";
import Panel from "./Panel";

const TargetPanel = () => {
  const { currentTargetName, currentTargetObject } = useVisualiser();
  const displayName = currentTargetName[0].toUpperCase() + currentTargetName.substring(1);
  return (
    <div id="target-panel-container" className="panel-container">
      <Panel title={`Target: ${displayName}`}>
        {currentTargetObject ? (
          <div>
            Position
            {["x", "y", "z"].map((key) => (
              <div key={key}>
                {key}: {currentTargetObject.position3d[key].toFixed(3) ?? ""}
              </div>
            ))}
          </div>
        ) : null}
      </Panel>
    </div>
  );
};
export default TargetPanel;
