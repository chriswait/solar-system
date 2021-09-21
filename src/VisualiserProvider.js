import React, { createContext, useContext, useState, useRef } from "react";
import { Vector3 } from "three";

import { useSolarSystem } from "./SolarSystemProvider";
import { auToMeters } from "./util";
const ORBIT_MAX_UNITS = 500;

export const VisualiserContext = createContext({});

const VisualiserProvider = ({ children }) => {
  const cameraRef = useRef();
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

  const value = {
    cameraRef,
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
