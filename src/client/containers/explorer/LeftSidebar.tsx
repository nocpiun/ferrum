import React from "react";
import { ListGroup } from "react-bootstrap";

import { ExplorerLeftSidebarProps } from "../../types";

const LeftSidebar: React.FC<ExplorerLeftSidebarProps> = (props) => {
    return (
        <aside className="sidebar-left-container">
            <div className="header-container">
                <h3>收藏夹</h3>
            </div>
            <div className="body-container">
                <ListGroup id="starred-dir-list">{props.starredList ? props.starredList : null}</ListGroup>
            </div>
        </aside>
    );
}

export default LeftSidebar;
