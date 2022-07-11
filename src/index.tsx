import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Axios from "axios";
import md5 from "md5-node";

import Utils from "./Utils";

// The `config.json` is a configuration file,
// it will be generated automatically when the user run the app for the first time
// The configuration file generator: `src/server/InitConfig.js`
// 
// This may cause that the app cannot be built by `npm run build`
import * as config from "./config.json";

import Main from "./Main";
import Login from "./client/pages/Login";

import { version } from "./client/global";

if(window.location.pathname == "/" || window.location.pathname == "/dir") {
  window.location.href = "/dir/"; // default page
}

console.log(
  "%cFerrum Explorer%cv"+ version +" | By NriotHrreion\n"+
  "%c    Website: https://nin.red/#/projects/ferrum/\n"+
  "%cGithub Repo: https://github.com/NriotHrreion/ferrum\n",
  "font-size: 16pt;font-weight: bold; padding: 10px",
  "font-size: 8pt;color: gray",
  "font-size: 8pt;color: white",
  "font-size: 8pt;color: white"
);

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

// Verify & Rendering
const cookieKey = "fepw";
var pass = false;

if(Utils.getCookie(cookieKey) === md5(config.explorer.password)) {
  pass = true;
} else {
  var mainRoot = Utils.getElem("root");
  var loginRoot = Utils.getElem("login");

  mainRoot.style.display = "none";
  loginRoot.style.display = "block";
  ReactDOM.render(<Login />, loginRoot);
}

if(pass) {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Route path="*" component={Main}/>
      </Router>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
