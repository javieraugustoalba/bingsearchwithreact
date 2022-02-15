import React from "react";
import {doPrevSearchPage, doNextSearchPage} from "../components/utils.js"

function PaginationComponent(data) {
  return (
    <React.Fragment>
      <button onClick={doPrevSearchPage}>Prev</button>
      <button onClick={doNextSearchPage}>Next</button>
    </React.Fragment>
  );
}

export default PaginationComponent;
