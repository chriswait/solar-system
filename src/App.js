import React from "react";

import Visualiser from "./Visualiser.js";
import TargetPanel from "./TargetPanel.js";
import ClockPanel from "./ClockPanel";
import ObjectsPanel from "./ObjectsPanel";

const App = () => {
  return (
    <div id="container">
      <Visualiser />
      <TargetPanel />
      <ClockPanel />
      <ObjectsPanel />
    </div>
  );
};
export default App;
