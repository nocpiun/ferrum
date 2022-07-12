import React, { ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";

// pages
import Explorer from "./client/pages/Explorer";
import Editor from "./client/pages/Editor";
import PictureViewer from "./client/pages/PictureViewer";
import Terminal from "./client/pages/Terminal";
import License from "./client/pages/License";

import { plugins } from "./plugins";
import { version } from "./client/global";

// style sheets
import "bootstrap/dist/css/bootstrap.css";
import "filepond/dist/filepond.min.css";
import "xterm/css/xterm.css";
import "./client/style/layout.less";

const Main: React.FC<RouteComponentProps<{}, {}, unknown>> = (props) => {
    var component: ReactElement = <div></div>;
    var url = props.match.url;

    // Pages' registration
    if(url.indexOf("/dir") == 0) component = <Explorer path={decodeURI(url.replace("/dir", ""))}/>;
    if(url.indexOf("/edit") == 0) component = <Editor path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
    if(url.indexOf("/picture") == 0) component = <PictureViewer path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
    if(url.indexOf("/terminal") == 0) component = <Terminal/>;
    if(url.indexOf("/license") == 0) component = <License/>;

    // Plugin pages' registration
    for(let i = 0; i < plugins.length; i++) {
        if(url.indexOf(plugins[i].route) == 0) {
            const Plugin = plugins[i].self;
            component = <Plugin path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
        }
    }

    return component;
}

// Consider https://reactjs.org/docs/react-component.html#displayname
Main.displayName = "Ferrum Explorer v"+ version;

export default Main;
