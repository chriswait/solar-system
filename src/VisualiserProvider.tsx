import React, { useState, useRef, useEffect } from "react";
import { Mesh, Vector3 } from "three";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";

import { ORBIT_MAX_UNITS } from "./constants";
import { SolarSystemObject } from "./types";
import { useSolarSystem, VisualiserContext } from "./context";

const VisualiserProvider = ({ children }: { children: React.ReactNode }) => {
  const targetCameraRef = useRef<PerspectiveCameraType>(null!);
  const orbitControlsCameraRef = useRef<PerspectiveCameraType>(null!);
  const sunMeshRef = useRef<Mesh>(null!);
  const { objects, furthestOrbitMeters } = useSolarSystem();

  const scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters;
  const realToVisualised = ({ x, y, z }: Vector3) => new Vector3(x, z, y).multiplyScalar(scaleFactor);

  const calculateOrbitPoints = (object: SolarSystemObject): Vector3[] => {
    if (!object.lastOrbit.length) return [];
    const points = object.lastOrbit.map(realToVisualised);
    points.push(realToVisualised(object.lastOrbit[0]));
    return points;
  };

  const [targetName, setTargetName] = useState("sun");

  const objectsWith3DPositions = objects.map((object) => ({
    ...object,
    radius3d: object.radius * 1000 * scaleFactor * 10,
    orbitPoints3d: calculateOrbitPoints(object),
    position3d: realToVisualised(object.position),
  }));

  const currentTargetObject = objectsWith3DPositions.find(({ name }) => name === targetName);

  useEffect(() => {
    // When a new TargetCamera is attached, targetCameraRef.current will update
    // Clone the new camera so we can provide it to OrbitControls
    // (https://stackoverflow.com/a/53298655)
    if (targetCameraRef.current) {
      orbitControlsCameraRef.current = targetCameraRef.current.clone();
    }
  }, [targetCameraRef?.current]);

  useEffect(() => {
    // When the current target changes, reposition the camera(s)
    if (orbitControlsCameraRef.current) {
      // const radius = currentTargetObject?.radius3d ?? 1;
      // orbitControlsCameraRef.current.position.set(0.1, 0.1, 0.1);
      targetCameraRef.current.copy(orbitControlsCameraRef.current);
    }
  }, [currentTargetObject?.name]);

  return (
    <VisualiserContext.Provider
      value={{
        objects: objectsWith3DPositions,
        targetCameraRef,
        orbitControlsCameraRef,
        sunMeshRef,
        currentTargetName: targetName,
        setTargetName,
        currentTargetObject,
        scaleFactor,
        realToVisualised,
      }}
    >
      {children}
    </VisualiserContext.Provider>
  );
};

export default VisualiserProvider;
