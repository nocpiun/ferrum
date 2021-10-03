import { Component, ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";

import Explorer from "./components/Explorer";

import "bootstrap/dist/css/bootstrap.min.css";

export default class Main extends Component<RouteComponentProps<{}, {}, unknown>, {}> {
    private url: string;
    
    public constructor(props: RouteComponentProps) {
        super(props);

        this.url = props.match.url;
    }

    public render(): ReactElement {
        return (
            <div>
                <Explorer path={this.url}/>
            </div>
        );
    }
}
