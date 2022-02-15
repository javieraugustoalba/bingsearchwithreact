import React from 'react'

const toggleDisplay = () => {
    var element = document.getElementById("_http");
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

function HtmlComponent(props) {

    return (
        <React.Fragment>
             <button onClick={toggleDisplay}>HTTP</button>
            <div id="_http" style={{display: "none"}}></div>
        </React.Fragment>
      )
  
}

export default HtmlComponent

