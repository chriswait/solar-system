import React, { useState } from "react";

const Panel = ({ children, title, reverse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      {reverse && isExpanded && <div className="panel">{children}</div>}
      <div className="panel-heading">
        <h3>{title}</h3>
        <button
          className="panel-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>
      {!reverse && isExpanded && <div className="panel">{children}</div>}
    </>
  );
};

export default Panel;
