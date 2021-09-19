import React from "react";
import { useSolarSystem } from "./SolarSystemProvider";

const OverlayObject = ({ object: { position2D, name } }) => {
  const { setTargetName } = useSolarSystem();
  return position2D?.dist > 1 ? (
    <div
      className="overlay-object"
      style={{
        left: position2D.x + "px",
        top: position2D.y + "px",
        width: position2D.side + "px",
        height: position2D.side + "px",
        opacity: Math.min(1, position2D.dist / 2),
      }}
    >
      <div className="overlay-label" onClick={() => setTargetName(name)}>
        {name}
      </div>
    </div>
  ) : null;
};
export default OverlayObject;
