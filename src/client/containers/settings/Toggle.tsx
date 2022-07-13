import React, { Component, ReactElement } from "react";

import { ExplorerSettingsToggleProps, ExplorerSettingsToggleState } from "../../types";

export default class Toggle extends Component<ExplorerSettingsToggleProps, ExplorerSettingsToggleState> {
    public constructor(props: ExplorerSettingsToggleProps) {
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
                disabled={this.props.disabled ?? false}
                style={{
                    backgroundColor: this.getStatus() ? "rgba(13, 110, 253, .5)" : "rgba(44, 62, 80, .5)"
                }}>
                
                <div className="knob" style={{
                    backgroundColor: this.getStatus() ? "#0D6EFD" : "#2C3E50",
                    transform: this.getStatus() ? "translate3d(24px, 0, 0)" : "translate3d(0, 0, 0)"
                }}/>

            </button>
        );
    }
}
