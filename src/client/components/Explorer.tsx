import { Component, ReactElement } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import Axios from "axios";
import Utils from "../../Utils";

import starOutline from "../../icons/star_outline.svg";
import starRate from "../../icons/star_rate.svg";

export default class Explorer extends Component<ExplorerProps, ExplorerState> {        
    private path: string;
    private isStarred: boolean = false;
    
    public constructor(props: ExplorerProps) {
        super(props);

        this.state = {
            itemSelected: null
        };
        this.path = "C:"+ this.props.path;
    }

    private addDirItem(itemInfo: DirectoryItem): void {
        var listElem = document.getElementById("list");

        var item = document.createElement("button");
        item.className = "list-group-item list-group-item-action list-item";
        item.title = "Click to select, Double click to open.";
        item.setAttribute("data-info", JSON.stringify(itemInfo));
        if(itemInfo.isDirectory) {
            item.addEventListener("dblclick", function() {
                window.location.href += "/"+ this.innerText;
            });
        }
        item.addEventListener("click", (e) => this.handleItemSelect(e));
        item.addEventListener("blur", () => this.handleItemUnselect());
        var itemName = document.createElement("span");
        itemName.className = "list-item-name";
        itemName.innerText = itemInfo.fullName;
        item.appendChild(itemName);
        var itemSize = document.createElement("span");
        itemSize.className = "list-item-size";
        itemSize.innerText = itemInfo.size ? Utils.fomatFloat(itemInfo.size / 1024, 1) +"KB" : "";
        item.appendChild(itemSize);
        if(listElem != null) listElem.appendChild(item);
    }

    private handleBack(): void {
        if(this.path == "C:/") {
            alert("You are in the root directory.");
            return;
        }

        var pathArr = this.path.split("/");
        var newPath = "";
        for(let i = 1; i < pathArr.length - 1; i++) {
            newPath += "/"+ pathArr[i];
        }
        window.location.href = "http://"+ window.location.host +"/dir"+ newPath;
    }

    private handleEnter(e: React.KeyboardEvent): void {
        if(e.key == "Enter") {
            var elem = e.target as HTMLInputElement;
            window.location.href = "http://"+ window.location.host +"/dir"+ elem.value.replace("C:", "");
        }
    }

    private handleStar(): void {
        var starButton = document.getElementById("star");
        if(starButton == null) return;

        if(this.isStarred) {
            starButton.style.backgroundImage = "url("+ starOutline +")";
            this.isStarred = false;
        } else {
            starButton.style.backgroundImage = "url("+ starRate +")";
            this.isStarred = true;
        }
    }

    private handleItemSelect(e: MouseEvent): void {
        var elem = e.target as HTMLButtonElement;
        var info = elem.getAttribute("data-info");
        if(info == null) return;

        this.setState({
            itemSelected: JSON.parse(info)
        });

        this.setControlButtonsDisabled(false);
    }

    private handleItemUnselect(): void {
        // this.setState({
        //     itemSelected: null
        // });
        // this.setControlButtonsDisabled(true);
    }

    private handleOpenFile(): void {
        if(this.state.itemSelected == null) return;
        
        if(this.state.itemSelected.isFile) {
            window.location.href = "http://"+ window.location.host +"/edit/?path="+ Utils.toBase64(this.path.replace("C:", "") +"/"+ this.state.itemSelected.fullName);
        } else {
            window.location.href = "http://"+ window.location.host +"/dir/"+ this.path.replace("C:", "") +"/"+ this.state.itemSelected.fullName;
        }
    }
    
    private handleDeleteFile(): void {
        
    }
    
    private handleRenameFile(): void {
        
    }
    
    private handleDownloadFile(): void {
        
    }
    
    private handleUploadFile(): void {
        
    }
    
    private handleCreateFile(): void {
        
    }

    public render(): ReactElement {
        return (
            <div className="explorer">
                <div className="main-container">
                    <div className="header-container">
                        <h1>Ferrum Explorer</h1>
                        <Form.Control 
                            type="text"
                            className="path-input"
                            defaultValue={this.path}
                            placeholder="File path to explorer..."
                            onKeyDown={(e) => this.handleEnter(e)}/>
                        <button
                            className="star"
                            id="star"
                            onClick={() => this.handleStar()}></button>
                    </div>
                    <div className="toolbuttons-container">
                        <Button
                            id="open-file"
                            onClick={() => this.handleOpenFile()}
                            disabled>Open</Button>
                        <Button
                            id="delete-file"
                            onClick={() => this.handleDeleteFile()}
                            variant="danger"
                            disabled>Delete</Button>
                        <Button
                            id="rename-file"
                            onClick={() => this.handleRenameFile()}
                            disabled>Rename</Button>
                        <Button
                            id="download-file"
                            onClick={() => this.handleDownloadFile()}
                            disabled>Download</Button>
                        <Button
                            id="upload-file"
                            onClick={() => this.handleUploadFile()}>Upload</Button>
                        
                        <Button
                            id="create-file"
                            onClick={() => this.handleCreateFile()}
                            variant="success"
                            style={{float: "right", marginRight: "0"}}
                            >New File</Button>
                    </div>
                    <div className="list-container">
                        <ListGroup id="list">
                            <ListGroup.Item action className="list-item" onClick={() => this.handleBack()}>
                                <span className="list-item-name">..</span>
                                <span className="list-item-size">Back to the parent directory</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className="footer-container">
                        <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()}</p>
                        <p>Ferrum Explorer - Current Path: {this.path}</p>
                    </div>
                </div>
                <div className="sidebar-left-container">
                    <div className="header-container">
                        <h3>Starred Directory</h3>
                    </div>
                    <div className="body-container">

                    </div>
                </div>
                <div className="sidebar-right-container">
                     
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ this.path;
        var apiUrl = "http://"+ window.location.hostname +":3001";

        Axios.get(apiUrl +"/fetchDirInfo?path="+ Utils.toBase64(this.path))
            .then((res: FetchDirInfoResponse) => {
                if(res.data.err == 404) {
                    alert("Cannot find the specified directory.\nPlease check your input.");
                    return;
                }

                var list = res.data.list;
                for(let i = list.length - 1; i >= 0; i--) {
                    if(list[i].isFile) {
                        list = Utils.itemMoveToFirst(i, list);
                    }
                }
                for(let j = 0; j < list.length; j++) {
                    this.addDirItem(list[j]);
                }
            })
            .catch((err) => {throw err});
        
        // Axios.get(apiUrl +"/getIsStarred?path="+ Utils.toBase64(this.path))
        //     .then((res) => {

        //     })
        //     .catch((err) => {throw err});
    }

    private setControlButtonsDisabled(is: boolean): void {
        var openButton = document.getElementById("open-file") as HTMLButtonElement,
            deleteButton = document.getElementById("delete-file") as HTMLButtonElement,
            renameButton = document.getElementById("rename-file") as HTMLButtonElement,
            downloadButton = document.getElementById("download-file") as HTMLButtonElement;

        openButton.disabled = deleteButton.disabled = renameButton.disabled = downloadButton.disabled = is;
    }
}

interface FetchDirInfoResponse {
    data: {list: DirectoryItem[], err?: number}
}

interface DirectoryItem {
    isDirectory: boolean
    isFile: boolean
    fullName: string
    format?: string
    size?: number
}

interface ExplorerProps {
    path: string
}

interface ExplorerState {
    itemSelected: DirectoryItem | null
}
