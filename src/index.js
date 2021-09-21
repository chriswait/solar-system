import App from "./App.js";
import ClockProvider from "./ClockProvider.js";
import SolarSystemProvider from "./SolarSystemProvider.js";
import VisualiserProvider from "./VisualiserProvider.js";
import React from "react";
import { render } from "react-dom";
import "./index.css";

if (window.WebGLRenderingContext) {
  render(
    <ClockProvider>
      <SolarSystemProvider>
        <VisualiserProvider>
          <App />
        </VisualiserProvider>
      </SolarSystemProvider>
    </ClockProvider>,
    document.getElementById("app")
  );
} else {
  window.location = "http://get.webgl.org/";
}
