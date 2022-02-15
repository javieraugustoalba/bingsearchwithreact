import React from "react";

const toggleDisplay = () => {
    var element = document.getElementById("_json");
    if (element) {
      var display = element.style.display;
      if (display === "none") {
        element.style.display = "block";
        window.scrollBy(0, 200);
      } else {
        element.style.display = "none";
      }
    }
  };

function JsonComponent(props) {

  return (
    <React.Fragment>
        <button onClick={toggleDisplay}>JSON</button>
        <div id="_json" style={{ display: "none" }}></div>
    </React.Fragment>
  );
}

export default JsonComponent;
