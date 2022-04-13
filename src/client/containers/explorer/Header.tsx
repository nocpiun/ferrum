import { Component, ReactElement } from "react";
import { Form } from "react-bootstrap";

import { ExplorerHeaderProps } from "../../types";
// (@main-width - 10px * (@button-num + 1) + 5px * (@button-num - 1) - 25px * @button-num)
export default class Header extends Component<ExplorerHeaderProps> {
    public constructor(props: ExplorerHeaderProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum 文件管理器</h1>
                <nav>
                    <Form.Control 
                        type="text"
                        className="path-input"
                        defaultValue={this.props.path}
                        placeholder="文件夹路径..."
                        onKeyDown={(e) => this.props.onEnter(e)}/>
                    <button
                        className="header-button set-password"
                        id="set-password"
                        title="设置密码"
                        onClick={() => this.props.onSetPassword()}></button>
                    <button
                        className="header-button star"
                        id="star"
                        title="收藏"
                        onClick={() => this.props.onStar()}></button>
                </nav>
            </div>
        );
    }
}
