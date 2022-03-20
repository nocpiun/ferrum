import { Component, ReactElement } from "react";
import { ListGroup } from "react-bootstrap";

import { ExplorerListProps } from "../../types";

export default class List extends Component<ExplorerListProps, {}> {
    public constructor(props: ExplorerListProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="list-container">
                <ListGroup id="list">
                    <ListGroup.Item action className="list-item" onClick={() => this.props.onBack()} data-type="folder">
                        <span className="list-item-name">..</span>
                        <span className="list-item-size">Back to the parent directory</span>
                    </ListGroup.Item>
                    {this.props.itemList ? this.props.itemList : null}
                </ListGroup>
            </div>
        );
    }
}
