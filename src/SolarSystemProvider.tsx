import React, { useMemo } from "react";

import { SolarSystemContext, useClock } from "./context";
import { SolarSystemObjects } from "./data/solar-system";
import { auToMeters } from "./util";
import { getLastOrbitAtCenturiesPastJ2000, getPositionAtCenturiesPastJ2000 } from "./orbit-mechanics";

const SolarSystemProvider = ({ children }: { children: React.ReactNode }) => {
  const { centuriesPastJ2000 } = useClock();

  const objectsWithPositions = useMemo(
    () =>
      SolarSystemObjects.map((object) => ({
        ...object,
        position: getPositionAtCenturiesPastJ2000(centuriesPastJ2000, object.orbit),
        lastOrbit: getLastOrbitAtCenturiesPastJ2000(centuriesPastJ2000, object.orbit),
      })),
    [centuriesPastJ2000]
  );

  const lastObject = objectsWithPositions[objectsWithPositions.length - 1];
  const furthestOrbitMeters = auToMeters(lastObject.orbit?.keplerianElements.initial.semiMajorAxisAu ?? 0);

  return (
    <SolarSystemContext.Provider
      value={{
        objects: objectsWithPositions,
        furthestOrbitMeters,
      }}
    >
      {children}
    </SolarSystemContext.Provider>
  );
};

export default SolarSystemProvider;
