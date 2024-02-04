import { createContext, useContext } from "react";
import { SolarSystemObject, VisualiserObject } from "./types";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import { Mesh, Vector3 } from "three";

type ClockContextType = {
  currentDate: Date;
  julianDate: number;
  centuriesPastJ2000: number;
  clockRateSeconds: number;
  setClockRateSeconds: React.Dispatch<React.SetStateAction<number>>;
};
export const ClockContext = createContext<ClockContextType>({
  currentDate: new Date(),
  julianDate: 0,
  centuriesPastJ2000: 0,
  clockRateSeconds: 0,
  setClockRateSeconds: () => {},
});
export const useClock = () => useContext(ClockContext);

type VisualiserContextType = {
  objects: VisualiserObject[];
  targetCameraRef?: React.MutableRefObject<PerspectiveCameraType>;
  orbitControlsCameraRef?: React.MutableRefObject<PerspectiveCameraType>;
  sunMeshRef?: React.MutableRefObject<Mesh>;
  currentTargetName: string;
  setTargetName: React.Dispatch<React.SetStateAction<string>>;
  currentTargetObject?: VisualiserObject;
  scaleFactor: number;
  realToVisualised: (position: Vector3) => Vector3;
};
export const VisualiserContext = createContext<VisualiserContextType>({
  objects: [],
  targetCameraRef: undefined,
  orbitControlsCameraRef: undefined,
  sunMeshRef: undefined,
  currentTargetName: "",
  setTargetName: () => {},
  scaleFactor: 0,
  realToVisualised: () => new Vector3(0, 0, 0),
});
export const useVisualiser = () => useContext(VisualiserContext);

type SolarSystemContextType = {
  objects: SolarSystemObject[];
  furthestOrbitMeters: number;
};
export const SolarSystemContext = createContext<SolarSystemContextType>({
  objects: [],
  furthestOrbitMeters: 0,
});
export const useSolarSystem = () => useContext(SolarSystemContext);
