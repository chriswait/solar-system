import { Suspense } from "react";

import { SPHERE_SEGMENTS, SPHERE_RINGS } from "../constants";
import { useVisualiser } from "../context";
import BodyMesh from "./BodyMesh";
import ObjectLabel from "./ObjectLabel";
import { VisualiserObject } from "../types";
import { Detailed, Icosahedron } from "@react-three/drei";

const Star = ({ object }: { object: VisualiserObject }) => {
  const { setTargetName, sunMeshRef } = useVisualiser();
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <Detailed distances={[0, object.radius3d * 5]}>
        <mesh onClick={onClick} ref={sunMeshRef}>
          <sphereGeometry attach="geometry" args={[object.radius3d, SPHERE_SEGMENTS, SPHERE_RINGS]} />
          <Suspense fallback={<meshLambertMaterial attach="material" color={object.color} />}>
            <BodyMesh map={object.map} />
          </Suspense>
        </mesh>
        <Icosahedron args={[object.radius3d * 2, 6]} onClick={onClick}>
          <meshBasicMaterial attach="material" color={object.color} wireframe />
        </Icosahedron>
      </Detailed>
      <ObjectLabel object={object} onClick={onClick} />
    </>
  );
};

export default Star;
