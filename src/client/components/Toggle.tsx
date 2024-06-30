import React, { Component, ReactElement } from "react";

import { ToggleProps, ToggleState } from "../types";

export default class Toggle extends Component<ToggleProps, ToggleState> {
    public constructor(props: ToggleProps) {
        super(props);

        this.state = {
            isOn: this.props.defaultValue
        };
    }

    public getStatus(): boolean {
        return this.state.isOn;
    }

    public setStatus(isOn: boolean): void {
        this.setState({ isOn });
    }

    public render(): ReactElement {
        return (
            <button
                className="toggle"
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    this.setStatus(!this.getStatus());
                }}
                id={this.props.id}
                disabled={this.props.disabled ?? false}
                style={{
                    backgroundColor: this.getStatus() ? "rgba(13, 110, 253, .5)" : "rgba(44, 62, 80, .5)"
                }}>
                
                <div className="knob" style={{
                    backgroundColor: this.getStatus() ? "#0D6EFD" : "#2C3E50",
                    transform: this.getStatus() ? "translate3d(24px, 0, 0)" : "translate3d(0, 0, 0)"
                }}>{this.props.children}</div>

            </button>
        );
    }
}
