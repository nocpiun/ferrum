import { Component, ReactElement } from "react";

import { BarState } from "../types";

export default class Bar extends Component<{}, BarState> {
    public constructor() {
        super({});

        this.state = {
            value: 0
        };
    }
    
    public setValue(value: number): void {
        this.setState({ value });
    }

    public render(): ReactElement {
        return (
            <div className="bar">
                <div className="bar-value" title={this.state.value +"%"} style={{width: this.state.value +"%"}}></div>
            </div>
        );
    }
}
