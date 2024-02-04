import { useCallback } from "react";
import { BufferGeometry } from "three";
import { VisualiserObject } from "../types";

const Orbit = ({ object }: { object: VisualiserObject }) => {
  const orbitGeometryRef = useCallback(
    (node: BufferGeometry) => {
      if (node) {
        node.setFromPoints(object.orbitPoints3d);
      }
    },
    [object]
  );
  return (
    <line>
      <bufferGeometry ref={orbitGeometryRef} />
      <lineBasicMaterial color={object.color} />
    </line>
  );
};

export default Orbit;
