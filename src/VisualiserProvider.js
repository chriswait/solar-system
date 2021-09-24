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
const ORBIT_MAX_UNITS = 500;

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

  const [targetName, setTargetName] = useState("sun");
  const currentTargetObject = objects.find(({ name }) => name === targetName);
  const currentTargetPosition = realToVisualised(currentTargetObject.position);

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
      const radius = currentTargetObject.radius * 1000 * scaleFactor;
      orbitControlsCameraRef.current.position.set(0.01, 0.01, 0.01);
      targetCameraRef.current.copy(orbitControlsCameraRef.current);
    }
  }, [currentTargetObject.name]);

  const value = {
    targetCameraRef,
    orbitControlsCameraRef,
    sunMeshRef,
    currentTargetName: targetName,
    setTargetName,
    currentTargetObject,
    scaleFactor,
    realToVisualised,
    currentTargetObject,
    currentTargetPosition,
  };

  return (
    <VisualiserContext.Provider value={value}>
      {children}
    </VisualiserContext.Provider>
  );
};

export const useVisualiser = () => useContext(VisualiserContext);

export default VisualiserProvider;
