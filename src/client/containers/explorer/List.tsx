import React from "react";
import { ListGroup } from "react-bootstrap";

import { ExplorerListProps } from "../../types";

const List: React.FC<ExplorerListProps> = (props) => {
    return (
        <div className="list-container">
            <ListGroup id="list">
                {props.itemList ? props.itemList : null}
            </ListGroup>
        </div>
    );
}

export default List;
