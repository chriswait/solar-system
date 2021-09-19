import React, { createContext, useContext, useState, useEffect } from "react";

import { useClock } from "./ClockProvider";
import { UniverseObject } from "./universe-object";
import SolarSystemData from "./data/solar-system";

const SolarSystemContext = createContext();

const SolarSystemProvider = ({ children }) => {
  const { centuriesPastJ2000 } = useClock();

  const [universeObjects, setUniverseObjects] = useState(
    SolarSystemData.objects.map(
      (solarSystemObject) => new UniverseObject(solarSystemObject)
    )
  );
  const objectsWithPositions = [...universeObjects].map((object) => ({
    ...object,
    position: object.getPositionAtCenturiesPastJ2000(centuriesPastJ2000),
    lastOrbit: object.getLastOrbitAtCenturiesPastJ2000(centuriesPastJ2000),
  }));
  const lastObject = objectsWithPositions[objectsWithPositions.length - 1];

  const [targetName, setTargetName] = useState("sun");
  const currentTargetObject = objectsWithPositions.find(
    ({ name }) => name === targetName
  );

  const [cameraPosition, setCameraPosition] = useState(null);

  const value = {
    // getters
    lastObject,
    currentTargetName: targetName,
    currentTargetObject,
    currentTargetPosition: currentTargetObject?.position,
    currentCameraPosition: cameraPosition,
    objects: objectsWithPositions,
    objectWithName: () => {
      return (name) => {
        return universeObjects.find((ob) => ob.name === name);
      };
    },
    // mutations
    setTargetName,
    setCameraPosition,
  };

  return (
    <SolarSystemContext.Provider value={value}>
      {children}
    </SolarSystemContext.Provider>
  );
};

export const useSolarSystem = () => useContext(SolarSystemContext);

export default SolarSystemProvider;
