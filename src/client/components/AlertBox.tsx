import { Component, ReactElement } from "react";
import { Alert, Button } from "react-bootstrap";

import { AlertBoxProps } from "../types";
import Emitter from "../emitter";

export default class AlertBox extends Component<AlertBoxProps, {}> {
    public constructor(props: AlertBoxProps) {
        super(props);
    }
    
    public render(): ReactElement {
        return (
            <Alert variant={this.props.variant} className="alert-box" style={this.props.style}>
                <Alert.Heading>{this.props.heading}</Alert.Heading>
                <div>
                    {this.props.children}
                </div>
                <hr/>
                <div className="close-button-container">
                    <Button variant={"outline-"+ this.props.variant} onClick={() => {
                        Emitter.get().emit("closeAlert", this.props.alertId);
                    }}>Close</Button>
                </div>
            </Alert>
        );
    }
}
