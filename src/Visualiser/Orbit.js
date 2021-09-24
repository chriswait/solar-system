import React, { useCallback } from "react";
import { useVisualiser } from "../VisualiserProvider";
import { ORBIT_POINTS } from "../constants";

const Orbit = ({ object }) => {
  const { realToVisualised } = useVisualiser();
  const points = [];
  for (let i = 0; i < ORBIT_POINTS; i++) {
    points.push(realToVisualised(object.lastOrbit[i]));
  }
  points.push(realToVisualised(object.lastOrbit[0]));
  const orbitGeometryRef = useCallback((node) => {
    if (node) {
      node.setFromPoints(points);
    }
  });
  return (
    <line>
      <bufferGeometry ref={orbitGeometryRef} />
      <lineBasicMaterial color={object.color} />
    </line>
  );
};

export default Orbit;
