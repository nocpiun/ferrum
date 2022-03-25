import { Component, ReactElement } from "react";
import { ListGroup } from "react-bootstrap";

import { ExplorerLeftSidebarProps } from "../../types";

export default class LeftSidebar extends Component<ExplorerLeftSidebarProps, {}> {
    public constructor(props: ExplorerLeftSidebarProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="sidebar-left-container">
                <div className="header-container">
                    <h3>收藏夹</h3>
                </div>
                <div className="body-container">
                    <ListGroup id="starred-dir-list">{this.props.starredList ? this.props.starredList : null}</ListGroup>
                </div>
            </div>
        );
    }
}
