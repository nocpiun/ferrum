import React from "react";
import { ListGroup, Form } from "react-bootstrap";

import { ExplorerListProps, ItemType } from "../../types";

const List: React.FC<ExplorerListProps> = (props) => {
    return (
        <div className="list-container">
            <ListGroup id="list">
                <ListGroup.Item
                    action
                    className="list-item"
                    onClick={() => props.onBack()}
                    data-type={ItemType.FOLDER}>
                    <Form.Check className="list-item-checkbox" disabled/>
                    <span className="list-item-name">..</span>
                    <span className="list-item-size">返回上级目录</span>
                </ListGroup.Item>
                {props.itemList ? props.itemList : null}
            </ListGroup>
        </div>
    );
}

export default List;
