import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Vector3 } from "three";

import { useSolarSystem } from "./SolarSystemProvider";
import { auToMeters } from "./util";
import { ORBIT_MAX_UNITS, ORBIT_POINTS } from "./constants";

export const VisualiserContext = createContext({});

const VisualiserProvider = ({ children }) => {
  const targetCameraRef = useRef();
  const orbitControlsCameraRef = useRef();
  const sunMeshRef = useRef();
  const { objects, lastObject } = useSolarSystem();

  const furthestOrbitMeters = auToMeters(
    lastObject.orbit.keplerianElements.initial.semiMajorAxisAu
  );
  const scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters;
  const realToVisualised = ({ x, y, z }) =>
    new Vector3(x, z, y).multiplyScalar(scaleFactor);

  const calculateOrbitPoints = (object) => {
    const points = [];
    for (let i = 0; i < ORBIT_POINTS; i++) {
      points.push(realToVisualised(object.lastOrbit[i]));
    }
    points.push(realToVisualised(object.lastOrbit[0]));
    return points;
  };

  const [targetName, setTargetName] = useState("sun");

  const objectsWith3DPositions = objects.map((object) => ({
    ...object,
    position3d: realToVisualised(object.position),
    radius3d: object.radius * 1000 * scaleFactor * 10,
    orbitPoints3d: object.lastOrbit ? calculateOrbitPoints(object) : undefined,
  }));

  const currentTargetObject = objectsWith3DPositions.find(
    ({ name }) => name === targetName
  );

  useEffect(() => {
    // When a new TargetCamera is attached, targetCameraRef.current will update
    // Clone the new camera so we can provide it to OrbitControls
    // (https://stackoverflow.com/a/53298655)
    if (targetCameraRef.current) {
      orbitControlsCameraRef.current = targetCameraRef.current.clone();
    }
  }, [targetCameraRef.current]);

  useEffect(() => {
    // When the current target changes, reposition the camera(s)
    if (orbitControlsCameraRef.current) {
      // const radius = currentTargetObject.radius3d;
      orbitControlsCameraRef.current.position.set(0.01, 0.01, 0.01);
      targetCameraRef.current.copy(orbitControlsCameraRef.current);
    }
  }, [currentTargetObject.name]);

  const value = {
    objects: objectsWith3DPositions,
    targetCameraRef,
    orbitControlsCameraRef,
    sunMeshRef,
    currentTargetName: targetName,
    setTargetName,
    currentTargetObject,
    scaleFactor,
    realToVisualised,
    currentTargetObject,
  };

  return (
    <VisualiserContext.Provider value={value}>
      {children}
    </VisualiserContext.Provider>
  );
};

export const useVisualiser = () => useContext(VisualiserContext);

export default VisualiserProvider;
