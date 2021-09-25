import React, { Suspense, Fragment } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useContextBridge, Stats } from "@react-three/drei";
import {
  EffectComposer,
  Noise,
  Vignette,
  GodRays,
} from "@react-three/postprocessing";

import { ORBIT_MAX_UNITS } from "../constants";
import { SolarSystemContext, useSolarSystem } from "../SolarSystemProvider";
import { VisualiserContext, useVisualiser } from "../VisualiserProvider";
import TargetCamera from "./TargetCamera";
import Stars from "./Stars";
import Orbit from "./Orbit";
import Planet from "./Planet";
import Star from "./Star";

const Visualiser = () => {
  const ContextBridge = useContextBridge(SolarSystemContext, VisualiserContext);
  const {
    objects,
    currentTargetName,
    currentTargetObject,
    orbitControlsCameraRef,
    sunMeshRef,
  } = useVisualiser();

  return (
    <div id="visualizer-container">
      <Canvas>
        <color attach="background" args={["black"]} />
        <Stats />
        <ContextBridge>
          <OrbitControls
            camera={orbitControlsCameraRef.current}
            maxDistance={ORBIT_MAX_UNITS * 1.5}
            minDistance={currentTargetObject.radius3d * 1.5}
            enablePan={false}
          />
          <Suspense fallback={<>Loading</>}>
            <Stars />
          </Suspense>
          {objects.map((object) => (
            <Fragment key={object.name}>
              <group position={object.position3d}>
                {object.name === currentTargetName && <TargetCamera />}
                {object.star ? (
                  <Star key={object.name} object={object} />
                ) : (
                  <Planet key={object.name} object={object} />
                )}
              </group>
              {object.lastOrbit && <Orbit object={object} />}
            </Fragment>
          ))}
        </ContextBridge>
        <EffectComposer>
          <Noise opacity={0.01} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
          {sunMeshRef.current && (
            <GodRays
              sun={sunMeshRef.current}
              density={0.5}
              decay={1.0}
              weight={0.1}
              clampMax={0.6}
            />
          )}
        </EffectComposer>
      </Canvas>
    </div>
  );
};
export default Visualiser;
