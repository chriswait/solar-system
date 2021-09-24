import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const BodyMesh = ({ map }) => {
  const mapTexture = useLoader(TextureLoader, map);
  return <meshBasicMaterial attach="material" map={mapTexture} />;
};

export default BodyMesh;
