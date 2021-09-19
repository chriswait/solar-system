import React from "react";

import Visualizer from "./Visualizer.js";
import ControlPanel from "./ControlPanel.js";

const App = () => {
  return (
    <div id="container">
      <Visualizer />
      <ControlPanel />
    </div>
  );
};
export default App;
