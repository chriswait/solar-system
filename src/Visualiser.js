import React, { Suspense, useCallback, Fragment } from "react";

import { BackSide } from "three";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useContextBridge,
  Detailed,
  Icosahedron,
  Stats,
  Html,
} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { SolarSystemContext, useSolarSystem } from "./SolarSystemProvider";

import StarField from "./images/starfield.png";
import { ORBIT_POINTS } from "./constants";
import { VisualiserContext, useVisualiser } from "./VisualiserProvider";

const NEAR = 0.001;
const VIEW_ANGLE = 80;
const SPHERE_SEGMENTS = 16;
const SPHERE_RINGS = 16;
const ORBIT_MAX_UNITS = 5000;
const HOVER_COLOR = "white";

const BodyMesh = ({ map }) => {
  const mapTexture = useLoader(TextureLoader, map);
  return <meshBasicMaterial attach="material" map={mapTexture} rotation={1} />;
};

const Star = ({ object }) => {
  const { scaleFactor, setTargetName } = useVisualiser();
  const radius = object.radius * 1000 * scaleFactor * 10;
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <Detailed distances={[0, radius * 20]}>
        <mesh onClick={onClick}>
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
        <Icosahedron args={[radius, 3]}>
          <meshBasicMaterial attach="material" color={object.color} wireframe />
        </Icosahedron>
      </Detailed>
      <ObjectLabel object={object} onClick={onClick} />
    </>
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

const ObjectLabel = ({ object, onClick }) => (
  <Html
    style={{
      color: "white",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: object.color,
      borderRadius: 5,
      backgroundColor: "black",
      padding: 5,
    }}
  >
    <div onClick={onClick}>{object.name}</div>
  </Html>
);

const Planet = ({ object }) => {
  const { scaleFactor, setTargetName, currentTargetName } = useVisualiser();
  const radius = object.radius * 1000 * scaleFactor * 10;
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <Detailed distances={[0, radius * 20]}>
        <mesh onClick={onClick}>
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
        </mesh>
        <Icosahedron args={[radius, 6]} onClick={onClick}>
          <meshBasicMaterial attach="material" color={object.color} wireframe />
        </Icosahedron>
      </Detailed>
      <ObjectLabel object={object} onClick={onClick} />
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

const TargetCamera = () => {
  // This camera is designed to be attached to a parent, which can then orbit around.
  // This is usually impossible for OrbitControls, which expects the camera not to be attached to anything moving/rotating
  // (https://github.com/mrdoob/three.js/pull/16374#issuecomment-489465084)
  const { targetCameraRef, orbitControlsCameraRef } = useVisualiser();
  useFrame(() => {
    // In each frame, copy the position of OrbitControl's camera
    // https://stackoverflow.com/a/53298655
    if (orbitControlsCameraRef.current) {
      targetCameraRef.current.copy(orbitControlsCameraRef.current);
    }
  });
  return (
    <PerspectiveCamera
      makeDefault
      fov={VIEW_ANGLE}
      near={NEAR}
      far={ORBIT_MAX_UNITS * 4}
      ref={targetCameraRef}
      position={[0, 10, 10]}
    />
  );
};

const Visualiser = () => {
  const ContextBridge = useContextBridge(SolarSystemContext, VisualiserContext);

  const { objects } = useSolarSystem();
  const {
    currentTargetName,
    realToVisualised,
    currentTargetObject,
    scaleFactor,
    orbitControlsCameraRef,
  } = useVisualiser();

  return (
    <div id="visualizer-container">
      <Canvas>
        <color attach="background" args={["black"]} />
        <Stats />
        <ContextBridge>
          <OrbitControls
            camera={orbitControlsCameraRef.current}
            maxDistance={ORBIT_MAX_UNITS * 0.4}
            minDistance={currentTargetObject.radius * 1000 * scaleFactor * 15}
          />
          <Suspense fallback={<>Loading</>}>
            <Stars />
          </Suspense>
          {objects.map((object) => (
            <Fragment key={object.name}>
              <group position={realToVisualised(object.position)}>
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
      </Canvas>
    </div>
  );
};
export default Visualiser;
