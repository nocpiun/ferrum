/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import Axios from "axios";

// components
import ListItem from "../components/ListItem";
import StarredItem from "../components/StarredItem";

import Utils from "../../Utils";
import { FetchDirInfoResponse, ExplorerProps, ExplorerState } from "../types";

// icons
import starRate from "../../icons/star_rate.svg";

export const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3001";

export default class Explorer extends Component<ExplorerProps, ExplorerState> {        
    private path: string;
    private isStarred: boolean = false;
    
    public constructor(props: ExplorerProps) {
        super(props);

        this.state = {
            itemSelected: null,
            itemList: null,
            starredList: null
        };
        this.path = "C:"+ this.props.path;
    }

    /**
     * Back to the parent directory
     */
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
        window.location.href = hostname +":3000/dir"+ newPath;
    }

    /**
     * Enter the directory that is entered by user in the textarea
     */
    private handleEnter(e: React.KeyboardEvent): void {
        if(e.key == "Enter") {
            var elem = e.target as HTMLInputElement;
            window.location.href = hostname +":3000/dir"+ elem.value.replace("C:", "");
        }
    }

    private handleStar(): void {
        if(!this.isStarred) {
            Axios.post(apiUrl +"/addStarred", {"path": this.path})
                .then(() => window.location.reload())
                .catch((err) => {throw err});
        } else {
            Axios.post(apiUrl +"/deleteStarred", {"path": this.path})
                .then(() => window.location.reload())
                .catch((err) => {throw err});
        }
    }

    /**
     * When item is selected
     */
    private handleItemSelect(elem: HTMLButtonElement): void {
        var info = elem.getAttribute("data-info");
        if(info == null) return;

        this.setState({
            itemSelected: JSON.parse(info)
        });

        if(!this.state.itemSelected) return;

        if(this.state.itemSelected.isFile) {
            this.setControlButtonsDisabled(false, false, false, false);
        } else {
            this.setControlButtonsDisabled(false, false, false, true);
        }
    }

    /**
     * Unselect item
     */
    private handleItemUnselect(): void {
        this.setState({
            itemSelected: null
        });
        this.setControlButtonsDisabled(true, true, true, true);
    }

    private handleOpenFile(): void {
        if(this.state.itemSelected == null) return;
        
        if(this.state.itemSelected.isFile) {
            window.location.href = hostname +":3000/edit/?path="+ (this.path.replace("C:", "") +"/"+ this.state.itemSelected.fullName).replaceAll("/", "\\");
        } else {
            window.location.href += "/"+ this.state.itemSelected.fullName;
        }
    }
    
    private handleDeleteFile(): void {
        
    }
    
    private handleRenameFile(): void {
        
    }
    
    private handleDownloadFile(): void {
        if(this.state.itemSelected == null) return;

        if(this.state.itemSelected.isFile) {
            window.location.href = hostname +":3001/getFileData?path="+ (this.path +"/"+ this.state.itemSelected.fullName).replaceAll("/", "\\");
        }
    }
    
    private handleUploadFile(): void {
        
    }
    
    private handleCreateFile(): void {
        
    }

    public render(): ReactElement {
        return (
            <div className="explorer">
                <div className="main-container" id="main">
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
                            onClick={() => this.handleOpenFile()}>Open</Button>
                        <Button
                            id="delete-file"
                            onClick={() => this.handleDeleteFile()}
                            variant="danger">Delete</Button>
                        <Button
                            id="rename-file"
                            onClick={() => this.handleRenameFile()}>Rename</Button>
                        <Button
                            id="download-file"
                            onClick={() => this.handleDownloadFile()}>Download</Button>
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
                            <ListGroup.Item action className="list-item" onClick={() => this.handleBack()} data-type="folder">
                                <span className="list-item-name">..</span>
                                <span className="list-item-size">Back to the parent directory</span>
                            </ListGroup.Item>
                            {this.state.itemList}
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
                        <ListGroup id="starred-dir-list">{this.state.starredList}</ListGroup>
                    </div>
                </div>
                <div className="sidebar-right-container">
                     
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ this.path;

        // The control buttons is defaultly disabled
        this.setControlButtonsDisabled(true, true, true, true);

        document.addEventListener("click", (e) => {
            var elem = e.target as HTMLElement;
            var info = elem.getAttribute("data-info");
            if(info) return;
            if(
                elem.className == "sidebar-right-container" ||
                elem.className == "sidebar-left-container" || 
                elem.className == "explorer" ||
                elem.className == "header-container" ||
                elem.className == "toolbuttons-container" ||
                elem.className == "footer-container"
            ) {
                this.handleItemUnselect();
            }
        });

        // Get the info of current directory
        Axios.get(apiUrl +"/fetchDirInfo?path="+ this.path.replaceAll("/", "\\"))
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

                this.setState({
                    itemList: (
                        <>
                            {
                                list.map((value, index) => {
                                    return <ListItem
                                        itemType={value.isFile ? "file" : "folder"}
                                        itemName={value.fullName}
                                        itemSize={value.size ? value.size : -1}
                                        itemInfo={JSON.stringify(value)}
                                        onClick={(e) => this.handleItemSelect(e)}
                                        key={index}
                                    />;
                                })
                            }
                        </>
                    )
                });
            })
            .catch((err) => {throw err});
        
        // Check if the current directory is starred & List all the starred directories
        Axios.get(apiUrl +"/getStarred")
            .then((res) => {
                var list = new Map(res.data);
                // display the full star if the directory is starred
                list.forEach((value, index) => {
                    if(value == this.path) {
                        Utils.getElem("star").style.backgroundImage = "url("+ starRate +")";
                        this.isStarred = true;
                    }
                });

                var listArr: [any, any][] = Array.from(list);
                // list the starred directories
                this.setState({
                    starredList: (
                        <>
                            {
                                listArr.map((value, index) => {
                                    if(typeof value[1] == "string") {
                                        return <StarredItem itemPath={value[1] as string} key={index}/>;
                                    }
                                })
                            }
                        </>
                    )
                });
            })
            .catch((err) => {throw err});
    }

    private setControlButtonsDisabled(openBtn: boolean, deleteBtn: boolean, renameBtn: boolean, downloadBtn: boolean): void {
        var openButton = document.getElementById("open-file") as HTMLButtonElement,
            deleteButton = document.getElementById("delete-file") as HTMLButtonElement,
            renameButton = document.getElementById("rename-file") as HTMLButtonElement,
            downloadButton = document.getElementById("download-file") as HTMLButtonElement;

        // openButton.disabled = deleteButton.disabled = renameButton.disabled = downloadButton.disabled = is;
        openButton.disabled = openBtn;
        deleteButton.disabled = deleteBtn;
        renameButton.disabled = renameBtn;
        downloadButton.disabled = downloadBtn;
    }
}
