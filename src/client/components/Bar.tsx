import React from "react";

import { BarProps } from "../types";

const Bar: React.FC<BarProps> = (props) => {
    return (
        <div className="bar">
            <div
                className="bar-value"
                title={props.value +"%"}
                style={{ transform: "scaleX("+ props.value / 100 +")" }}/>
        </div>
    );
}

export default Bar;
