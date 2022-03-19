import { Component, ReactElement } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import Utils from "../../Utils";
import { EditorProps } from "../types";

export default class Editor extends Component<EditorProps, {}> {
    private path: string;

    public constructor(props: EditorProps) {
        super(props);

        this.path = "C:"+ this.props.path.replaceAll("\\", "/");
    }

    public render(): ReactElement {
        return (
            <div className="editor">
                <div className="main-container">
                    <div className="header-container">
                        <h1>Ferrum Text Editor</h1>
                        <p>Path: {this.path}</p>
                    </div>
                    <div className="toolbar-container">
                        
                    </div>
                    <div className="text-container">

                    </div>
                </div>
            </div>
        );
    }
}
