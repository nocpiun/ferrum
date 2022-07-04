import { Component, ReactElement } from "react";
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

export default class Main extends Component<RouteComponentProps<{}, {}, unknown>, {}> {
    public static displayName: string = "Ferrum Explorer v"+ version;

    public constructor(props: RouteComponentProps) {
        super(props);
    }

    public render(): ReactElement {
        var component: ReactElement = <div></div>;
        var url = this.props.match.url;

        if(url.indexOf("/dir") == 0) component = <Explorer path={decodeURI(url.replace("/dir", ""))}/>;
        if(url.indexOf("/edit") == 0) component = <Editor path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
        if(url.indexOf("/picture") == 0) component = <PictureViewer path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
        if(url.indexOf("/terminal") == 0) component = <Terminal/>;
        if(url.indexOf("/license") == 0) component = <License/>;

        for(let i = 0; i < plugins.length; i++) {
            if(url.indexOf(plugins[i].route) == 0) {
                const Plugin = plugins[i].self;
                component = <Plugin path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
            }
        }

        return component;
    }
}
