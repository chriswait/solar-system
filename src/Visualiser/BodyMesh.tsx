import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const BodyMesh = ({ map }: { map: string }) => {
  const mapTexture = useLoader(TextureLoader, map);
  return <meshBasicMaterial attach="material" map={mapTexture} />;
};

export default BodyMesh;
