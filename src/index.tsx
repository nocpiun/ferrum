import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Axios from "axios";
import md5 from "md5-node";

import PluginLoader from "./plugin/PluginLoader";
import LocalStorage from "./client/utils/localStorage";
import Logger from "./client/utils/logger";
import Utils from "./Utils";
// import * as config from "./config.json";

import Main from "./Main";
import Login from "./client/pages/Login";

import { apiUrl, version, pluginStorageKey } from "./client/global";
import { Config } from "./client/types";
import MainContext from "./client/contexts/MainContext";

// Register native plugins
import "./plugin";

export const isDemo = typeof document.body.getAttribute("demo") === "string" ? true : false;

console.warn = (value) => {
  Logger.warn({ value });
};

Logger.log({ value: "Launching..." });

if(window.location.pathname == "/" || window.location.pathname == "/dir") {
  window.location.href = "/dir/"; // default page
}

Logger.log(
  { value: "%c\nFerrum Explorer%cv"+ version +" | By NriotHrreion\n"+
  "%c    Website: https://nin.red/#/projects/ferrum/\n"+
  "%cGithub Repo: https://github.com/NriotHrreion/ferrum\n\n"+
  "%c       Demo: https://ferrum-demo.nin.red\n" },
  "font-size: 16pt;font-weight: bold; padding: 10px",
  "font-size: 8pt;color: gray",
  "font-size: 8pt;color: white",
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
    Logger.log(
      { as: "Hitokoto", value: "%c"+ res.data.hitokoto +"%c ————"+ res.data.from_who +"《"+ res.data.from +"》" },
      "font-weight: bold", "font-weight: 400;color: yellow"
    );
  })
  .catch((err) => {throw err});

// Verify & Rendering
(async function() {

  // Register external plugins
  await (async function() {
    var plugins = LocalStorage.getItem<string[]>(pluginStorageKey);
    if(plugins && plugins.length != 0) {
      for(let i = 0; i < plugins.length; i++) {
        await PluginLoader.get().loadExternalPlugin(plugins[i]);
      }
    }
  })();

  async function getConfig(): Promise<Config> {
    return (await Axios.get<{config: Config}>(apiUrl +"/getConfig")).data.config;
  }

  // The `config.json` is a configuration file,
  // it will be generated automatically when the user run the app for the first time
  // The configuration file generator: `src/server/InitConfig.js`
  // 
  // In demo mode, the `config.json` will automatically change into `config-demo.json`,
  // so that the app can be able to run
  // `config-demo.json` is equal to a default configuration
  // 
  // `config-demo.json` is quite necessary.
  // The `config.json` isn't included in the source code,
  // so when it's in demo mode, there need to be a file which isn't in `.gitignore`.
  // Otherwise, Netlify won't be able to build the app.
  const config: Config = !isDemo ?
    await getConfig() :
    (await import("./config-demo.json")).default as unknown as Config;

  // Verify
  const cookieKey = "fepw";
  var pass = false;
  
  if(Utils.getCookie(cookieKey) === md5(config.explorer.password)) {
    pass = true;
  } else {
    // Rendering
    var mainRoot = Utils.getElem("root");
    var loginRoot = Utils.getElem("login");
    
    mainRoot.style.display = "none";
    loginRoot.style.display = "block";
    ReactDOM.render(<Login isDemo={isDemo}/>, loginRoot);
  }
  
  // Rendering
  if(pass) {
    ReactDOM.render(
      <React.StrictMode>
        {/* Consider MainContext component in `src/client/contexts/MainContext.tsx` */}
        <MainContext.Provider value={{ isDemo, config }}>
          <Router>
            <Route path="*" component={Main}/>
          </Router>
        </MainContext.Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  }
})();
