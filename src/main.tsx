import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import ClockProvider from "./ClockProvider";
import SolarSystemProvider from "./SolarSystemProvider";
import VisualiserProvider from "./VisualiserProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClockProvider>
      <SolarSystemProvider>
        <VisualiserProvider>
          <App />
        </VisualiserProvider>
      </SolarSystemProvider>
    </ClockProvider>
    ,
  </React.StrictMode>
);
