import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";

import { ExplorerToolButtonsProps } from "../../types";

export default class ToolButtons extends Component<ExplorerToolButtonsProps, {}> {
    public constructor(props: ExplorerToolButtonsProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="toolbuttons-container">
                <Button
                    id="open-file"
                    onClick={() => this.props.onOpenFile()}>Open</Button>
                <Button
                    id="delete-file"
                    onClick={() => this.props.onDeleteFile()}
                    variant="danger">Delete</Button>
                <Button
                    id="rename-file"
                    onClick={() => this.props.onRenameFile()}>Rename</Button>
                <Button
                    id="download-file"
                    onClick={() => this.props.onDownloadFile()}>Download</Button>
                <Button
                    id="upload-file"
                    onClick={() => this.props.onUploadFile()}>Upload</Button>
                
                <Button
                    id="create-file"
                    onClick={() => this.props.onCreateFile()}
                    variant="success"
                    style={{float: "right", marginRight: "0"}}
                    >New File</Button>
            </div>
        );
    }
}
