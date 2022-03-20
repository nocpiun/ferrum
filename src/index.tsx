/* eslint-disable eqeqeq */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./Main";

if(window.location.pathname == "/" || window.location.pathname == "/dir") {
  window.location.href = "/dir/"; // default page
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="*" component={Main}/>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
