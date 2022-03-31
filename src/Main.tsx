import { Component, ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";

// pages
import Explorer from "./client/pages/Explorer";
import Editor from "./client/pages/Editor";
import PictureViewer from "./client/pages/PictureViewer";

import { plugins } from "./plugins";

// style sheets
import "bootstrap/dist/css/bootstrap.css";
import "filepond/dist/filepond.min.css";
import "./client/style/layout.less";

export default class Main extends Component<RouteComponentProps<{}, {}, unknown>, {}> {
    public constructor(props: RouteComponentProps) {
        super(props);
    }

    public render(): ReactElement {
        var component: ReactElement = <div></div>;
        var url = this.props.match.url;

        if(url.indexOf("/dir") == 0) component = <Explorer path={decodeURI(url.replace("/dir", ""))}/>;
        if(url.indexOf("/edit") == 0) component = <Editor path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
        if(url.indexOf("/picture") == 0) component = <PictureViewer path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;

        for(let i = 0; i < plugins.length; i++) {
            if(url.indexOf(plugins[i].route) == 0) {
                const Plugin = plugins[i].self;
                component = <Plugin path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
            }
        }

        return component;
    }
}
