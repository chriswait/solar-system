import React, { useCallback } from "react";
import { Line } from "@react-three/drei";

const Orbit = ({ object }) => {
  const orbitGeometryRef = useCallback((node) => {
    if (node) {
      node.setFromPoints(object.orbitPoints3d);
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
