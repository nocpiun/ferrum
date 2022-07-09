import React from "react";
import { ListGroup } from "react-bootstrap";

import { hostname } from "../global";
import { StarredItemProps } from "../types";
import * as config from "../../config.json";

const root = config.explorer.root;

const StarredItem: React.FC<StarredItemProps> = (props) => {
    return (
        <ListGroup.Item
            action
            title={props.itemPath}
            onClick={() => {
                window.location.href = hostname +":3300/dir/"+ props.itemPath.replace(root +"/", "");
            }}
        >
            <span className="list-item-name">{props.itemPath}</span>
        </ListGroup.Item>
    );
}

export default StarredItem;
