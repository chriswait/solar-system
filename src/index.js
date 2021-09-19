import App from "./App.js";
import SolarSystemProvider from "./SolarSystemProvider.js";
import ClockProvider from "./ClockProvider.js";
import React from "react";
import { render } from "react-dom";
import "./index.css";

if (window.WebGLRenderingContext) {
  render(
    <ClockProvider>
      <SolarSystemProvider>
        <App />
      </SolarSystemProvider>
    </ClockProvider>,
    document.getElementById("app")
  );
} else {
  window.location = "http://get.webgl.org/";
}
