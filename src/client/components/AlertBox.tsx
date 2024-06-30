import React from "react";
import { Alert, Button } from "react-bootstrap";

import Emitter from "../utils/emitter";
import Utils from "../../Utils";
import { AlertBoxProps } from "../types";

/** @deprecated */
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
                }}>{Utils.$("alert.close")}</Button>
            </div>
        </Alert>
    );
}

export default AlertBox;
