import React from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import { useVisualiser } from "../VisualiserProvider";
import { VIEW_ANGLE, NEAR, ORBIT_MAX_UNITS } from "../constants";

const TargetCamera = () => {
  // This camera is designed to be attached to a parent, which can then orbit around.
  // This is usually impossible for OrbitControls, which expects the camera not to be attached to anything moving/rotating
  // (https://github.com/mrdoob/three.js/pull/16374#issuecomment-489465084)
  const { targetCameraRef, orbitControlsCameraRef } = useVisualiser();
  useFrame(() => {
    // In each frame, copy the position of OrbitControl's camera
    // https://stackoverflow.com/a/53298655
    if (orbitControlsCameraRef.current) {
      targetCameraRef.current.copy(orbitControlsCameraRef.current);
    }
  });
  return (
    <PerspectiveCamera
      makeDefault
      fov={VIEW_ANGLE}
      near={NEAR}
      far={ORBIT_MAX_UNITS * 4}
      ref={targetCameraRef}
      position={[0, 10, 10]}
    />
  );
};

export default TargetCamera;
