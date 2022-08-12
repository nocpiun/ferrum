import React from "react";

import { ExplorerRightSidebarPanelProps } from "../../types";

const RightSidebarPanel: React.FC<ExplorerRightSidebarPanelProps> = (props) => {
    return (
        <div className="right-sidebar-panel" id={props.id}>
            {props.title ? (<div className="header-container">
                <p>{props.title}</p>
            </div>) : null}

            <div className="body-container">
                {props.children}
            </div>
        </div>
    );
};

export default RightSidebarPanel;
