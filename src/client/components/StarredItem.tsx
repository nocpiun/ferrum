import { Component, ReactElement } from "react";
import { ListGroup } from "react-bootstrap";

import { hostname } from "../pages/Explorer";
import { StarredItemProps } from "../types";
import * as config from "../../config.json";

const root = config.explorer.root;

export default class StarredItem extends Component<StarredItemProps, {}> {
    public constructor(props: StarredItemProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <ListGroup.Item
                action
                title="单击以打开"
                onClick={() => {
                    window.location.href = hostname +":3300/dir/"+ this.props.itemPath.replace(root +"/", "");
                }}
            >
                <span className="list-item-name">{this.props.itemPath}</span>
            </ListGroup.Item>
        );
    }
}
