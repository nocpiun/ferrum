import React from "react";

import { ExplorerSettingsOptionProps } from "../../types";

const Option: React.FC<ExplorerSettingsOptionProps> = (props) => {
    return (
        <div className="settings-option">
            <span>{props.name}</span>
            <dd className="description">{props.description ? props.description : ""}</dd>
            {props.children}
        </div>
    );
}

export default Option;
