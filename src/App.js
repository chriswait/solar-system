import React from "react";

import Visualiser from "./Visualiser/Visualiser";
import TargetPanel from "./Panels/TargetPanel";
import ClockPanel from "./Panels/ClockPanel";
import ObjectsPanel from "./Panels/ObjectsPanel";

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
