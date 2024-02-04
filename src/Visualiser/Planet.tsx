import { Suspense } from "react";
import { Detailed, Icosahedron } from "@react-three/drei";

import { SPHERE_SEGMENTS, SPHERE_RINGS } from "../constants";
import { useVisualiser } from "../context";
import BodyMesh from "./BodyMesh";
import ObjectLabel from "./ObjectLabel";
import { VisualiserObject } from "../types";

const Planet = ({ object }: { object: VisualiserObject }) => {
  const { setTargetName } = useVisualiser();
  const onClick = () => setTargetName(object.name);
  return (
    <>
      <Detailed distances={[0, object.radius3d * 20]}>
        <mesh onClick={onClick}>
          <sphereGeometry attach="geometry" args={[object.radius3d, SPHERE_SEGMENTS, SPHERE_RINGS]} />
          <Suspense fallback={<meshLambertMaterial attach="material" color={object.color} />}>
            <BodyMesh map={object.map} />
          </Suspense>
        </mesh>
        <Icosahedron args={[object.radius3d * 40, 6]} onClick={onClick}>
          <meshBasicMaterial attach="material" color={object.color} wireframe />
        </Icosahedron>
      </Detailed>
      <ObjectLabel object={object} onClick={onClick} />
    </>
  );
};

export default Planet;
