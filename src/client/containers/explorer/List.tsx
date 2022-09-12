import React from "react";
import { ListGroup } from "react-bootstrap";

import { ExplorerListProps } from "../../types";
import Utils from "../../../Utils";

const List: React.FC<ExplorerListProps> = (props) => {
    return (
        <div className="list-container">
            <ListGroup id="list" title={Utils.$("page.explorer.list.item.tooltip")}>
                {props.itemList ? props.itemList : null}
            </ListGroup>
        </div>
    );
}

export default List;
