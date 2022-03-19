/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { ListGroup } from "react-bootstrap";
import Utils from "../../Utils";
import { ListItemProps } from "../types";

export default class ListItem extends Component<ListItemProps, {}> {
    private itemSize: string;
    
    public constructor(props: ListItemProps) {
        super(props);

        if(this.props.itemSize > -1) {
            this.itemSize = Utils.fomatFloat(this.props.itemSize / 1024, 1) +"KB";
        } else {
            this.itemSize = "";
        }
    }

    public render(): ReactElement {
        return (
            <ListGroup.Item
                action
                className="list-item"
                title="Click to select, Double click to open."
                onClick={(e) => this.props.onClick(e.target as HTMLButtonElement)}
                onDoubleClick={() => {
                    if(this.props.itemType == "folder") window.location.href += "/"+ this.props.itemName;
                }}
                data-info={this.props.itemInfo}
                data-type={this.props.itemType}
            >
                <span className="list-item-name" onClick={(e) => this.props.onClick((e.target as HTMLElement).parentElement as HTMLButtonElement)}>{this.props.itemName}</span>
                <span className="list-item-size" onClick={(e) => this.props.onClick((e.target as HTMLElement).parentElement as HTMLButtonElement)}>{this.itemSize}</span>
            </ListGroup.Item>
        );
    }
}
