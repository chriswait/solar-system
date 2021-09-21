import React, { Suspense, useRef, useState, useCallback } from "react";

import { BackSide, Vector3 } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { useSolarSystem } from "./SolarSystemProvider";
import OverlayObject from "./OverlayObject";

import { auToMeters, degreesToRadians } from "./util";
import StarField from "./images/starfield.png";
import { ORBIT_POINTS } from "./constants";

const NEAR = 0.01;
const FAR = 3000;
const VIEW_ANGLE = 45;
const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;
const ORBIT_MAX_UNITS = 500;
const HOVER_COLOR = "white";

const realToVisualised = ({ x, y, z }, scaleFactor) =>
  new Vector3(x, z, y).multiplyScalar(scaleFactor);

const Star = ({ object, scaleFactor, currentTargetMeshRef, setTargetName }) => {
  const map = useLoader(TextureLoader, object.map);
  const radius = object.radius * 1000 * scaleFactor * 10;
  return (
    <mesh onClick={() => setTargetName(object.name)} ref={currentTargetMeshRef}>
      <sphereGeometry
        attach="geometry"
        args={[radius, SPHERE_SEGMENTS, SPHERE_RINGS]}
      />
      <Suspense
        fallback={
          <meshLambertMaterial
            attach="material"
            args={[{ color: object.color }]}
          />
        }
      >
        <meshBasicMaterial attach="material" map={map} rotation={1} />
      </Suspense>
      <pointLight color="white" intensity={0.1} distance={0} />
      <ambientLight color="white" intensity={0.1} />
    </mesh>
  );
};

const Orbit = ({ object, scaleFactor }) => {
  const points = [];
  for (let i = 0; i < ORBIT_POINTS; i++) {
    points.push(realToVisualised(object.lastOrbit[i], scaleFactor));
  }
  points.push(realToVisualised(object.lastOrbit[0], scaleFactor));
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

const Planet = ({
  object,
  scaleFactor,
  currentTargetMeshRef,
  setTargetName,
}) => {
  const map = useLoader(TextureLoader, object.map);
  const radius = object.radius * 1000 * scaleFactor * 10;
  return (
    <mesh
      position={realToVisualised(object.position, scaleFactor)}
      onClick={() => setTargetName(object.name)}
      ref={currentTargetMeshRef}
    >
      <sphereGeometry
        attach="geometry"
        args={[radius, SPHERE_SEGMENTS, SPHERE_RINGS]}
      />
      <Suspense
        fallback={
          <meshLambertMaterial
            attach="material"
            args={[{ color: object.color }]}
          />
        }
      >
        <meshBasicMaterial attach="material" map={map} rotation={1} />
      </Suspense>
    </mesh>
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

const Visualizer = () => {
  const { objects, lastObject, currentTargetName, setTargetName } =
    useSolarSystem();
  const cameraRef = useRef();
  const currentTargetMeshRef = useRef();

  const furthestOrbitMeters = auToMeters(
    lastObject.orbit.keplerianElements.initial.semiMajorAxisAu
  );
  const scaleFactor = ORBIT_MAX_UNITS / furthestOrbitMeters;

  return (
    <div id="visualizer-container">
      <Canvas>
        <OrbitControls
          camera={cameraRef.current}
          target={currentTargetMeshRef.current?.position}
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
            <Suspense fallback={<>Loading</>} key={object.name}>
              <Star
                object={object}
                scaleFactor={scaleFactor}
                currentTargetMeshRef={
                  object.name === currentTargetName
                    ? currentTargetMeshRef
                    : undefined
                }
                setTargetName={setTargetName}
              />
            </Suspense>
          ) : (
            object.map && (
              <React.Fragment key={object.name}>
                <Suspense fallback={<>Loading</>}>
                  <Planet
                    object={object}
                    key={object.name}
                    scaleFactor={scaleFactor}
                    currentTargetMeshRef={
                      object.name === currentTargetName
                        ? currentTargetMeshRef
                        : undefined
                    }
                    setTargetName={setTargetName}
                  />
                  <Orbit object={object} scaleFactor={scaleFactor} />
                </Suspense>
              </React.Fragment>
            )
          )
        )}
      </Canvas>
    </div>
  );
};
export default Visualizer;
