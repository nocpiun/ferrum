import { Component, ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";
import Utils from "./Utils";

import Explorer from "./client/components/Explorer";
import Editor from "./client/components/Editor";

import "bootstrap/dist/css/bootstrap.css";
import "./client/style/layout.less";

export default class Main extends Component<RouteComponentProps<{}, {}, unknown>, {}> {
    public constructor(props: RouteComponentProps) {
        super(props);
    }

    public render(): ReactElement {
        var component: ReactElement = <div></div>;
        var url = this.props.match.url;

        if(url.indexOf("/dir") == 0) {
            component = <Explorer path={decodeURI(url.replace("/dir", ""))}/>;
        }

        if(url.indexOf("/edit") == 0) {
            component = <Editor path={this.props.location.search.replace("?path=", "").replaceAll("/", "\\")}/>;
        }

        return component;
    }
}
