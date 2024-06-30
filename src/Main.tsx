import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

// pages
import Explorer from "./client/pages/Explorer";
import Editor from "./client/pages/Editor";
import PictureViewer from "./client/pages/PictureViewer";
import Terminal from "./client/pages/Terminal";
import License from "./client/pages/License";
import Viewer from "./plugin/Viewer";

import PluginLoader from "./plugin/PluginLoader";
import Logger from "./client/utils/logger";
import { version } from "./client/global";

// style sheets
import "bootstrap/dist/css/bootstrap.css";
import "filepond/dist/filepond.min.css";
import "xterm/css/xterm.css";
import "./client/style/layout.less";

const Main: React.FC<RouteComponentProps<{}, {}, unknown>> = (props) => {
    var component: ReactElement = <div></div>;
    var url = props.match.url;

    // Registration of the pages
    if(url.indexOf("/dir") == 0) component = <Explorer path={decodeURI(url.replace("/dir", ""))}/>;
    if(url.indexOf("/edit") == 0) component = <Editor path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
    if(url.indexOf("/picture") == 0) component = <PictureViewer path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
    if(url.indexOf("/terminal") == 0) component = <Terminal/>;
    if(url.indexOf("/license") == 0) component = <License/>;

    /**
     * Load plugins
     * 
     * The first time:
     * load the viewer plugins before the other components are ready
     * 
     * The second time:
     * load the dialog plugins after the navbar element is ready (so it should be called in `useEffect`)
     * 
     * or the plugins won't be able to use
     */
    PluginLoader.get().load(); // 1
    useEffect(() => {
        PluginLoader.get().load(); // 2
    }, []);

    // Registration of viewer pages
    var viewers = PluginLoader.get().viewerList;

    for(let i = 0; i < viewers.length; i++) {
        if(url.indexOf(viewers[i].route) == 0) {
            Logger.log({ value: "Opening viewer..." }, viewers[i]);

            component = <Viewer
                path={props.location.search.replace("?path=", "").replaceAll("/", "\\")}
                viewerMetadata={viewers[i]}/>
        }
    }

    return component;
}

/** @see https://reactjs.org/docs/react-component.html#displayname */
Main.displayName = "Ferrum Explorer v"+ version;

export default Main;
