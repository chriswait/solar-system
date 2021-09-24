import React from "react";
import { useSolarSystem } from "./SolarSystemProvider";
import { useVisualiser } from "./VisualiserProvider";
import Panel from "./Panel";

const ObjectsPanel = () => {
  const { objects } = useSolarSystem();
  const { setTargetName } = useVisualiser();
  return (
    <div id="objects-control-container" className="panel-container">
      <Panel title="Objects" reverse>
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
      </Panel>
    </div>
  );
};

export default ObjectsPanel;
