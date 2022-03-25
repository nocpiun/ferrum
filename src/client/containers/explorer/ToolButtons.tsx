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
                    onClick={() => this.props.onOpenFile()}>打开</Button>
                <Button
                    id="delete-file"
                    onClick={() => this.props.onDeleteFile()}
                    variant="danger">删除</Button>
                <Button
                    id="rename-file"
                    onClick={() => this.props.onRenameFile()}>重命名</Button>
                <Button
                    id="download-file"
                    onClick={() => this.props.onDownloadFile()}>下载</Button>
                <Button
                    id="upload-file"
                    onClick={() => this.props.onUploadFile()}>上传</Button>
                
                <Button
                    id="create-directory"
                    onClick={() => this.props.onCreateDirectory()}
                    variant="success"
                    style={{float: "right", marginLeft: "10px", marginRight: "0"}}
                    >新建文件夹</Button>
                <Button
                    id="create-file"
                    onClick={() => this.props.onCreateFile()}
                    variant="success"
                    style={{float: "right", marginRight: "0"}}
                    >新建文件</Button>
            </div>
        );
    }
}
