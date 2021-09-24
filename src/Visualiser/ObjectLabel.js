import React from "react";
import { Html } from "@react-three/drei";

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
    zIndexRange={[20, 0]}
  >
    <div onClick={onClick}>{object.name}</div>
  </Html>
);

export default ObjectLabel;
