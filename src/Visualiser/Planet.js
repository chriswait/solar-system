import React, { Suspense } from "react";
import { Detailed, Icosahedron } from "@react-three/drei";

import { SPHERE_SEGMENTS, SPHERE_RINGS } from "../constants";
import { useVisualiser } from "../VisualiserProvider";
import BodyMesh from "./BodyMesh";
import ObjectLabel from "./ObjectLabel";

const Planet = ({ object }) => {
  const { setTargetName } = useVisualiser();
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <Detailed distances={[0, object.radius3d * 20]}>
        <mesh onClick={onClick}>
          <sphereGeometry
            attach="geometry"
            args={[object.radius3d, SPHERE_SEGMENTS, SPHERE_RINGS]}
          />
          <Suspense
            fallback={
              <meshLambertMaterial attach="material" color={object.color} />
            }
          >
            <BodyMesh map={object.map} />
          </Suspense>
        </mesh>
        <Icosahedron args={[object.radius3d, 6]} onClick={onClick}>
          <meshBasicMaterial attach="material" color={object.color} wireframe />
        </Icosahedron>
      </Detailed>
      <ObjectLabel object={object} onClick={onClick} />
    </>
  );
};

export default Planet;
