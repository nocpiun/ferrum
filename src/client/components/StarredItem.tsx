import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";

import MainContext from "../contexts/MainContext";

import { hostname } from "../global";
import { StarredItemProps } from "../types";
// import * as config from "../../config.json";

const StarredItem: React.FC<StarredItemProps> = (props) => {
    const { config } = useContext(MainContext);
    const root = config.explorer.root;

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
