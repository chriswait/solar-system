import React, { useState, useRef, useCallback, useEffect } from "react";

import { Screen } from "./screen";
import { useSolarSystem } from "./SolarSystemProvider";
import { OrbitControls } from "./orbit-controls";
import { FRAME_RATE } from "./constants";
import OverlayObject from "./OverlayObject";

const Visualizer = () => {
  const [hasInitialised, setHasInitialised] = useState(false);
  const {
    objects,
    lastObject,
    currentTargetName,
    setTargetName,
  } = useSolarSystem();
  // We need a stable reference to our screen and controls across renders
  const screenRef = useRef(new Screen());
  const controlsRef = useRef(null);

  const canvasRef = useCallback((node) => {
    if (node !== null) {
      const screen = screenRef.current;
      screen.initRenderer(node);
      screen.setScaleForOuterObject(lastObject);
      controlsRef.current = new OrbitControls(screen.camera, node);
      objects.forEach((object) => screen.drawObject(object));
      setHasInitialised(true);
    }
  }, []);

  // Render Loop
  useEffect(() => {
    if (hasInitialised) {
      const renderInterval = setInterval(() => {
        requestAnimationFrame(() => {
          objects.forEach((object) => screenRef.current.redrawObject(object));
          controlsRef.current.update();
          screenRef.current.render();
        });
      }, 1000 / 60);
      return () => {
        clearInterval(renderInterval);
      };
    }
  }, [hasInitialised, objects, lastObject]);

  useEffect(() => {
    screenRef.current.setCameraTarget(currentTargetName, controlsRef.current);
  }, [currentTargetName]);

  // Work out our 2d position for each object
  const objectsWithPositions = objects.map((object) => ({
    ...object,
    position2D: screenRef.current.get2DCoordinateForObject3D(
      screenRef.current.getMeshWithName(object.name)
    ),
  }));

  return (
    <div id="visualizer-container">
      <canvas
        id="solar-system-canvas"
        ref={canvasRef}
        onClick={() => {
          if (screenRef.current.hoverObject) {
            setTargetName(screenRef.current.hoverObject.userData.name);
          }
        }}
        onMouseMove={({ clientX, clientY }) => {
          screenRef.current.checkHoverObject(clientX, clientY);
        }}
      />
      {objectsWithPositions.map((object) => (
        <OverlayObject object={object} key={object.name} />
      ))}
    </div>
  );
};
export default Visualizer;
