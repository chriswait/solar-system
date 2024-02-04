import { Html } from "@react-three/drei";
import { useVisualiser } from "../context";
import { VisualiserObject } from "../types";

const ObjectLabel = ({ object, onClick }: { object: VisualiserObject; onClick: () => void }) => {
  const { targetCameraRef } = useVisualiser();
  const cameraDistance = (targetCameraRef?.current?.position.length() ?? 0) - object.radius3d;
  return cameraDistance > 0.05 ? (
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
  ) : null;
};

export default ObjectLabel;
