import React from "react";
import { Html } from "@react-three/drei";
import { useVisualiser } from "../VisualiserProvider";

const ObjectLabel = ({ object, onClick }) => {
  const { targetCameraRef, scaleFactor } = useVisualiser();
  const radius = object.radius * 1000 * scaleFactor * 10;
  const cameraDistance = targetCameraRef.current?.position.length() - radius;
  return (
    cameraDistance > 0.03 && (
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
        zIndexRange={[20, 0]}
      >
        <div onClick={onClick}>{object.name}</div>
      </Html>
    )
  );
};

export default ObjectLabel;
