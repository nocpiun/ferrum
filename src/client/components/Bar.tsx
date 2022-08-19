import { Component, ReactElement } from "react";

import { BarProps, BarState } from "../types";

export default class Bar extends Component<BarProps, BarState> {
    public constructor(props: BarProps) {
        super(props);

        this.state = {
            value: this.props.value ?? 0
        };
    }
    
    public setValue(value: number): void {
        this.setState({ value });
    }

    public render(): ReactElement {
        return (
            <div className="bar">
                <div
                    className="bar-value"
                    title={this.state.value +"%"}
                    style={{ transform: "scaleX("+ this.state.value / 100 +")" }}/>
            </div>
        );
    }
}
