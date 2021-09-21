import React from "react";

import Visualiser from "./Visualiser.js";
import ControlPanel from "./ControlPanel.js";

const App = () => {
  return (
    <div id="container">
      <Visualiser />
      <ControlPanel />
    </div>
  );
};
export default App;
