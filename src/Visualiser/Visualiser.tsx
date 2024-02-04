import { Suspense, Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars, useContextBridge } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";

import { ORBIT_MAX_UNITS } from "../constants";
import TargetCamera from "./TargetCamera";
// import Stars from "./Stars";
import Orbit from "./Orbit";
import Planet from "./Planet";
import Star from "./Star";
import { SolarSystemContext, VisualiserContext, useVisualiser } from "../context";

const Visualiser = () => {
  const ContextBridge = useContextBridge(SolarSystemContext, VisualiserContext);
  const {
    objects,
    currentTargetName,
    currentTargetObject,
    orbitControlsCameraRef,
    //  sunMeshRef
  } = useVisualiser();
  return (
    <div id="visualizer-container">
      <Canvas>
        <color attach="background" args={["black"]} />
        <Perf position="top-left" />
        <ContextBridge>
          <OrbitControls
            camera={orbitControlsCameraRef?.current}
            maxDistance={ORBIT_MAX_UNITS * 1.5}
            minDistance={(currentTargetObject?.radius3d ?? 0) * 1.5}
            enablePan={false}
            enableDamping
            zoomSpeed={2.5}
          />
          <Suspense>
            {/* <Stars /> */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />
          </Suspense>
          {objects.map((object) => (
            <Fragment key={object.name}>
              <group position={object.position3d}>
                {object.name === currentTargetName && <TargetCamera />}
                {object.star ? <Star object={object} /> : <Planet object={object} />}
              </group>
              {object.lastOrbit && <Orbit object={object} />}
            </Fragment>
          ))}
        </ContextBridge>
        <EffectComposer>
          <Noise opacity={0.01} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
          {/* Causing performance issues */}
          {/* <GodRays sun={sunMeshRef!} density={0.5} decay={1.0} weight={0.1} clampMax={0.6} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  );
};
export default Visualiser;
