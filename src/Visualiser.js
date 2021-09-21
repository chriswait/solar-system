import React, { Suspense, useRef, useCallback } from "react";

import { BackSide } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useContextBridge,
} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { SolarSystemContext, useSolarSystem } from "./SolarSystemProvider";
import OverlayObject from "./OverlayObject";

import StarField from "./images/starfield.png";
import { ORBIT_POINTS } from "./constants";
import { VisualiserContext, useVisualiser } from "./VisualiserProvider";

const NEAR = 0.01;
const FAR = 3000;
const VIEW_ANGLE = 45;
const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;
const ORBIT_MAX_UNITS = 500;
const HOVER_COLOR = "white";

const BodyMesh = ({ map }) => {
  const mapTexture = useLoader(TextureLoader, map);
  return <meshBasicMaterial attach="material" map={mapTexture} rotation={1} />;
};

const Star = ({ object, selectTarget }) => {
  const { scaleFactor } = useVisualiser();
  const meshRef = useRef();
  const radius = object.radius * 1000 * scaleFactor * 10;
  return (
    <mesh onClick={() => selectTarget(object, meshRef.current)} ref={meshRef}>
      <sphereGeometry
        attach="geometry"
        args={[radius, SPHERE_SEGMENTS, SPHERE_RINGS]}
      />
      <Suspense
        fallback={
          <meshLambertMaterial attach="material" color={object.color} />
        }
      >
        <BodyMesh map={object.map} />
      </Suspense>
      <pointLight color="white" intensity={0.1} distance={0} />
      <ambientLight color="white" intensity={0.1} />
    </mesh>
  );
};

const Orbit = ({ object }) => {
  const { realToVisualised } = useVisualiser();
  const points = [];
  for (let i = 0; i < ORBIT_POINTS; i++) {
    points.push(realToVisualised(object.lastOrbit[i]));
  }
  points.push(realToVisualised(object.lastOrbit[0]));
  const orbitGeometryRef = useCallback((node) => {
    if (node) {
      node.setFromPoints(points);
    }
  });
  return (
    <line>
      <bufferGeometry ref={orbitGeometryRef} />
      <lineBasicMaterial color={object.color} />
    </line>
  );
};

const Planet = ({ object, selectTarget }) => {
  const stuff = useVisualiser();
  console.log(stuff);
  const { realToVisualised, scaleFactor } = stuff;
  const meshRef = useRef();
  const position = realToVisualised(object.position);
  const radius = object.radius * 1000 * scaleFactor * 1000;
  return (
    <>
      <mesh
        position={position}
        onClick={() => selectTarget(object, meshRef.current)}
        ref={meshRef}
      >
        <sphereGeometry
          attach="geometry"
          args={[radius, SPHERE_SEGMENTS, SPHERE_RINGS]}
        />
        {object.map && (
          <Suspense
            fallback={
              <meshLambertMaterial attach="material" color={object.color} />
            }
          >
            <BodyMesh map={object.map} />
          </Suspense>
        )}
      </mesh>
      <Orbit object={object} />
    </>
  );
};

const Stars = () => {
  const starMap = useLoader(TextureLoader, StarField);
  return (
    <mesh>
      <sphereGeometry
        attach="geometry"
        args={[ORBIT_MAX_UNITS * 2, SPHERE_SEGMENTS, SPHERE_RINGS]}
      />
      <meshBasicMaterial attach="material" side={BackSide} map={starMap} />
    </mesh>
  );
};

const Visualiser = () => {
  const ContextBridge = useContextBridge(SolarSystemContext, VisualiserContext);
  const { objects } = useSolarSystem();
  const { setTargetName, currentTargetPosition } = useVisualiser();
  const cameraRef = useRef();
  const currentTargetPositionRef = useRef();

  const selectTarget = (object, mesh) => {
    currentTargetPositionRef.current = mesh.position;
    setTargetName(object.name);
  };

  return (
    <div id="visualizer-container">
      <Canvas>
        <ContextBridge>
          <OrbitControls
            camera={cameraRef.current}
            target={currentTargetPosition}
          />
          <PerspectiveCamera
            makeDefault
            fov={VIEW_ANGLE}
            near={NEAR}
            far={FAR}
            ref={cameraRef}
            position={[0, 70, 0]}
          />
          <Suspense fallback={<>Loading</>}>
            <Stars />
          </Suspense>
          {objects.map((object) =>
            object.star ? (
              <Star
                key={object.name}
                object={object}
                selectTarget={selectTarget}
              />
            ) : (
              <Planet
                key={object.name}
                object={object}
                key={object.name}
                selectTarget={selectTarget}
              />
            )
          )}
        </ContextBridge>
      </Canvas>
    </div>
  );
};
export default Visualiser;
