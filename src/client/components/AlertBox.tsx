import React from "react";
import { Alert, Button } from "react-bootstrap";

import { AlertBoxProps } from "../types";
import Emitter from "../utils/emitter";

const AlertBox: React.FC<AlertBoxProps> = (props) => {
    return (
        <Alert variant={props.variant} className="alert-box" style={props.style} id={props.id}>
            <Alert.Heading style={{fontWeight: "bold"}}>{props.heading}</Alert.Heading>
            <div>
                {props.children}
            </div>
            <hr/>
            <div className="close-button-container">
                <Button variant={"outline-"+ props.variant} onClick={() => {
                    Emitter.get().emit("closeAlert", props.alertId);
                }}>关闭</Button>
            </div>
        </Alert>
    );
}

export default AlertBox;
