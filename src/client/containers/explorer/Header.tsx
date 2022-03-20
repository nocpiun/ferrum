import { Component, ReactElement } from "react";
import { Form } from "react-bootstrap";

import { ExplorerHeaderProps } from "../../types";

export default class Header extends Component<ExplorerHeaderProps> {
    public constructor(props: ExplorerHeaderProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum Explorer</h1>
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={this.props.path}
                    placeholder="File path to explorer..."
                    onKeyDown={(e) => this.props.onEnter(e)}/>
                <button
                    className="star"
                    id="star"
                    onClick={() => this.props.onStar()}></button>
            </div>
        );
    }
}
