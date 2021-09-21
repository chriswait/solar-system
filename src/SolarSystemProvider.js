import React, { createContext, useContext, useState, useEffect } from "react";

import { useClock } from "./ClockProvider";
import { UniverseObject } from "./universe-object";
import SolarSystemData from "./data/solar-system";

export const SolarSystemContext = createContext();

const SolarSystemProvider = ({ children }) => {
  const { centuriesPastJ2000 } = useClock();

  const [universeObjects] = useState(
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

  const value = {
    objects: objectsWithPositions,
    lastObject,
  };

  return (
    <SolarSystemContext.Provider value={value}>
      {children}
    </SolarSystemContext.Provider>
  );
};

export const useSolarSystem = () => useContext(SolarSystemContext);

export default SolarSystemProvider;
