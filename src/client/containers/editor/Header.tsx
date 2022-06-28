import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";

import { EditorHeaderProps, EditorHeaderState } from "../../types";
import Emitter from "../../utils/emitter";

export default class Header extends Component<EditorHeaderProps, EditorHeaderState> {
    public constructor(props: EditorHeaderProps) {
        super(props);

        this.state = {
            hasChanged: false
        };
    }
    
    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum 文本编辑器</h1>
                {/* <p>路径: {this.props.path} <span style={{display: this.state.hasChanged ? "inline-block" : "none"}}>(*已编辑)</span></p> */}
                <div className="status-bar">
                    <span id="file-path">路径: {this.props.path}</span>
                    <span id="file-edited" style={{display: this.state.hasChanged ? "inline-block" : "none"}}>(*已编辑)</span>
                </div>
                <Button className="control-button" onClick={this.props.onSaveFile}>保存 (S)</Button>
                <Button className="control-button" onClick={this.props.onUndo}>撤销 (Z)</Button>
            </div>
        );
    }

    public componentDidMount(): void {
        Emitter.get().on("fileStatusChange", (hasChanged: boolean) => {
            this.setState({hasChanged});
        });
    }
}
