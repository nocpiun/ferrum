import React from "react";

import { ExplorerSettingsOptionProps } from "../../types";

const Option: React.FC<ExplorerSettingsOptionProps> = (props) => {
    return (
        <div className="settings-option">
            <span>{props.name}</span>
            <span className="description">{props.description ? "( "+ props.description +" )" : ""}</span>
            {props.children}
        </div>
    );
}

export default Option;
