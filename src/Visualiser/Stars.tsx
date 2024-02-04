import { useLoader } from "@react-three/fiber";
import { BackSide, TextureLoader } from "three";

import StarField from "../images/starfield.png";
import { ORBIT_MAX_UNITS, SPHERE_SEGMENTS, SPHERE_RINGS } from "../constants";

const Stars = () => {
  const starMap = useLoader(TextureLoader, StarField);
  return (
    <mesh>
      <sphereGeometry attach="geometry" args={[ORBIT_MAX_UNITS * 2, SPHERE_SEGMENTS, SPHERE_RINGS]} />
      <meshBasicMaterial attach="material" side={BackSide} map={starMap} />
    </mesh>
  );
};

export default Stars;
