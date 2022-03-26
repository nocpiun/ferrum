/* eslint-disable eqeqeq */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Axios from "axios";
import Main from "./Main";

if(window.location.pathname == "/" || window.location.pathname == "/dir") {
  window.location.href = "/dir/"; // default page
}

// Hitokoto
Axios.get("https://v1.hitokoto.cn/?c=i&encode=json", {responseType: "json"})
  .then((res: {
    data: {
      hitokoto: string
      type: string
      from: string
      from_who: string
      creator: string
      length: number
    }
  }) => {
    console.log("%c"+ res.data.hitokoto +"%c ————"+ res.data.from_who +"《"+ res.data.from +"》", "font-weight: bold", "font-weight: 400;color: yellow");
  })
  .catch((err) => {throw err});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="*" component={Main}/>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
