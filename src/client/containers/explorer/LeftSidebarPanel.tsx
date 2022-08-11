import React from "react";

import { ExplorerLeftSidebarPanelProps } from "../../types";

const LeftSidebarPanel: React.FC<ExplorerLeftSidebarPanelProps> = (props) => {
    return (
        <div className="left-sidebar-panel" id={props.id}>
            <div className="header-container">
                <p>{props.title}</p>
            </div>
            <div className="body-container">{props.children}</div>
        </div>
    );
};

export default LeftSidebarPanel;
