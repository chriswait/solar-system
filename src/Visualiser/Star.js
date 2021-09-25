import React, { Suspense } from "react";

import { SPHERE_SEGMENTS, SPHERE_RINGS } from "../constants";
import { useVisualiser } from "../VisualiserProvider";
import BodyMesh from "./BodyMesh";
import ObjectLabel from "./ObjectLabel";

const Star = ({ object }) => {
  const { setTargetName, sunMeshRef } = useVisualiser();
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <mesh onClick={onClick} ref={sunMeshRef}>
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
      <ObjectLabel object={object} onClick={onClick} />
    </>
  );
};

export default Star;
