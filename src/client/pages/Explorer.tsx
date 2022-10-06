import React, { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../contexts/MainContext";
import DirectoryInfoContext from "../contexts/DirectoryInfoContext";

// components
import ListItem from "../components/ListItem";
import StarredItem from "../components/StarredItem";
import Easter from "../components/Easter";

// containers
import Header from "../containers/explorer/Header";
import ToolButtons from "../containers/explorer/ToolButtons";
import List from "../containers/explorer/List";
import LeftSidebar from "../containers/explorer/LeftSidebar";
import RightSidebar from "../containers/explorer/RightSidebar";

import Utils from "../../Utils";
import Emitter from "../utils/emitter";
import Logger from "../utils/logger";
import {
    FetchDirInfoResponse,
    ExplorerProps,
    ExplorerState,
    DirectoryItem,
    ItemType,
    MainContextType
} from "../types";
import { hostname, apiUrl, editorDefaultValue } from "../global";
// import * as config from "../../config.json";
import PluginLoader from "../../plugin/PluginLoader";

export default class Explorer extends Component<ExplorerProps, ExplorerState> {
    public static contextType?: React.Context<MainContextType> | undefined = MainContext;
    private static root: string;
    private static port: string; // include `:`

    private _path: string = "";
    private isStarred: boolean = false;
    private isZipFile: boolean = false;
    public isLsidebarOpen: boolean = true;

    /**
     * Open a file in Ferrum Explorer
     */
    public static openFile(path: string, item: DirectoryItem): void {
        var itemFullName = item.fullName;
        var itemFormat = item.format?.toLowerCase();
        var itemPath = (path.replace(Explorer.root, "") +"/"+ itemFullName).replaceAll("/", "\\");
        var viewers = PluginLoader.get().viewerList;

        if(item.isFile && itemFormat) {
            if(Utils.formatTester(["exe", "sys", "com", "bin", "elf", "axf", "dll", "jar"], itemFormat)) {
                toast.error(Utils.$("toast.msg1"));
                return;
            }

            // Picture
            if(Utils.formatTester(["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "tiff", "ico"], itemFormat)) {
                window.location.href = hostname + Explorer.port +"/picture/?path="+ itemPath;
                return;
            }

            // Zip File
            if(Utils.formatTester(["zip"], itemFormat)) {
                window.location.href += "/"+ itemFullName;
                return;
            }

            for(let i = 0; i < viewers.length; i++) {
                if(Utils.formatTester(viewers[i].formats, itemFormat)) {
                    window.location.href = hostname + Explorer.port + viewers[i].route +"/?path="+ itemPath;
                    return;
                }
                console.log(viewers[i].formats, itemFormat);
            }

            window.location.href = hostname + Explorer.port +"/edit/?path="+ itemPath;
            return;
        }

        if(item.isFile && !itemFormat) {
            window.location.href = hostname + Explorer.port +"/edit/?path="+ itemPath;
            return;
        }

        window.location.href += "/"+ itemFullName;
    }
    
    // According to https://github.com/facebook/react/issues/6598,
    // the form of `constructor(props, context)` might will be deprecated in the near future.
    // But there seems just one way to make the constructor can read the context,
    // so I ignored the deprecation warning in the official docs.
    public constructor(props: ExplorerProps, context: MainContextType) {
        super(props);
        
        Explorer.root = context.config.explorer.root as string;
        Explorer.port = !context.isDemo ? ":3300" : "";

        this.state = {
            itemSelected: [],
            itemList: null,
            starredList: null,
            direcotryItems: []
        };
        this.path = Explorer.root + this.props.path;

        if(/\.zip$/.test(this.path)) { // Opening zip file
            this.isZipFile = true;
        }
    }

    private get path(): string {
        return this._path;
    }

    private set path(value: string) {
        document.body.setAttribute("path", value);
        this._path = value;
    }

    /**
     * Back to the parent directory
     */
    private handleBack(): void {
        if(this.path == Explorer.root +"/") {
            toast.error(Utils.$("toast.msg2"));
            return;
        }

        var pathArr = this.path.split("/");
        var newPath = "";
        for(let i = 1; i < pathArr.length - 1; i++) {
            newPath += "/"+ pathArr[i];
        }
        window.location.href = hostname + Explorer.port +"/dir"+ newPath;
    }

    /**
     * Enter the directory that is entered by user in the textarea
     */
    private handleEnter(e: React.KeyboardEvent): void {
        if(e.key == "Enter") {
            var elem = e.target as HTMLInputElement;
            window.location.href = hostname + Explorer.port +"/dir"+ elem.value.replace(Explorer.root, "");
        }
    }

    private handleStar(): void {
        if(this.context.isDemo) return;

        if(!this.isStarred) {
            Axios.post(apiUrl +"/addStarred", {"path": this.path})
                .then(() => this.refreshStarredList())
                .catch((err) => {throw err});
        } else {
            Axios.post(apiUrl +"/deleteStarred", {"path": this.path})
                .then(() => this.refreshStarredList())
                .catch((err) => {throw err});
        }
    }

    /**
     * When item is selected
     */
    private handleItemSelect(item: DirectoryItem): void {
        var list = this.state.itemSelected.slice(0); // `slice(0)` is in order to clone the list
        list.push(item);

        this.setState({
            itemSelected: list
        });

        if(list.length == 0) return;

        if(list.length == 1) {
            if(list[0].isFile) {
                this.setControlButtonsDisabled(false, false, false);
            } else {
                this.setControlButtonsDisabled(false, false, true);
            }

            return;
        }

        if(list.length > 1) {
            this.setControlButtonsDisabled(true, false, true);
        }
    }

    /**
     * Unselect item
     */
    private handleItemUnselect(item: DirectoryItem): void {
        var list = this.state.itemSelected.slice(0);
        var index = -1;

        for(let i = 0; i < list.length; i++) {
            if(list[i].fullName == item.fullName) {
                index = i;
            }
        }

        if(index > -1) {
            list.splice(index, 1);

            this.setState({
                itemSelected: list
            });
        }

        if(list.length == 0) {
            this.setControlButtonsDisabled(true, true, true);
            return;
        }

        if(list.length == 1) {
            if(list[0].isFile) {
                this.setControlButtonsDisabled(false, false, false);
            } else {
                this.setControlButtonsDisabled(false, false, true);
            }

            return;
        }

        if(list.length > 1) {
            this.setControlButtonsDisabled(true, false, true);
        }
    }

    private handleOpenFile(): void {
        if(this.state.itemSelected == null) return;
        if(this.state.itemSelected.length != 1) return;

        Explorer.openFile(this.path, this.state.itemSelected[0]);
    }
    
    private handleDeleteFile(): void {
        if(this.state.itemSelected == null) return;

        const deleteLoop = async (): Promise<void> => {
            if(this.state.itemSelected == null) return;
            for(let i = 0; i < this.state.itemSelected.length; i++) {
                Axios.post(apiUrl +"/deleteFile", {
                    path: (this.path +"/"+ this.state.itemSelected[i].fullName).replaceAll("/", "\\")
                });
            }
        }

        toast.promise(deleteLoop(), {
            loading: Utils.$("toast.msg3"),
            success: Utils.$("toast.msg4"),
            error: Utils.$("toast.msg5")
        }).then(() => {
            this.refreshItemList();
            this.setControlButtonsDisabled(true, true, true);
            this.setState({
                itemSelected: []
            });
        });
    }
    
    private handleDownloadFile(): void {
        if(this.state.itemSelected == null) return;
        if(this.state.itemSelected.length != 1) return;

        if(this.state.itemSelected[0].isFile && !this.context.isDemo) {
            window.location.href = hostname +":3301/getFileData?path="+ (this.path +"/"+ this.state.itemSelected[0].fullName).replaceAll("/", "\\");
        } else {
            window.location.href = "data:application/octet-stream,"+ editorDefaultValue;
        }
    }
    
    private async handleCreateFile(): Promise<void> {
        const newFileName = Utils.$("page.explorer.list.newfile");
        const newFileFormat = "txt";
        var dirInfo: FetchDirInfoResponse = await Axios.get(apiUrl +"/fetchDirInfo?path="+ this.path.replaceAll("/", "\\"));
        var dirItemList = dirInfo.data.list;
        var newFileIndex = 1;

        for(let i = 0; i < dirItemList.length; i++) {
            if(dirItemList[i].fullName.indexOf(newFileName) > -1) {
                newFileIndex++;
            }
        }

        const newFileFullName = `${newFileName}${newFileIndex == 1 ? "" : ` (${newFileIndex.toString()})`}.${newFileFormat}`;

        toast.promise(Axios.post(apiUrl +"/createFile", {
            path: this.path.replaceAll("/", "\\"),
            fileName: newFileFullName
        }), {
            loading: Utils.$("toast.msg6"),
            success: Utils.$("toast.msg7"),
            error: Utils.$("toast.msg8")
        }).then(() => this.refreshItemList());
    }

    private async handleCreateDirectory(): Promise<void> {
        const newDirName = Utils.$("page.explorer.list.newdir");
        var dirInfo: FetchDirInfoResponse = await Axios.get(apiUrl +"/fetchDirInfo?path="+ this.path.replaceAll("/", "\\"));
        var dirItemList = dirInfo.data.list;
        var newDirIndex = 1;

        for(let i = 0; i < dirItemList.length; i++) {
            if(dirItemList[i].fullName.indexOf(newDirName) > -1) {
                newDirIndex++;
            }
        }

        const newDirFullName = `${newDirName}${newDirIndex == 1 ? "" : ` (${newDirIndex.toString()})`}`;

        toast.promise(Axios.post(apiUrl +"/createDir", {
            path: this.path.replaceAll("/", "\\"),
            dirName: newDirFullName
        }), {
            loading: Utils.$("toast.msg6"),
            success: Utils.$("toast.msg7"),
            error: Utils.$("toast.msg8")
        }).then(() => this.refreshItemList());
    }

    public render(): ReactElement {
        return (
            <div className="explorer">
                <Easter />

                <div className="toast-container">
                    <Toaster position="bottom-right"/>
                </div>
                <div className="left-bottom-buttons">
                    <button
                        className="left-sidebar-open"
                        onClick={() => this.toggleLsidebar(!this.isLsidebarOpen)}/>
                </div>
                <DirectoryInfoContext.Provider value={{
                        path: this.path,
                        directoryItems: this.state.direcotryItems,
                        isZipFile: this.isZipFile
                    }}>
                    <LeftSidebar starredList={this.state.starredList}/>
                    <div className="main-container" id="main">
                        {/* Main */}
                        <Header
                            path={this.path}
                            onEnter={(e) => this.handleEnter(e)}
                            onStar={() => this.handleStar()}
                            onBack={() => this.handleBack()}/>
                        <ToolButtons
                            onOpenFile={() => this.handleOpenFile()}
                            onDeleteFile={() => this.handleDeleteFile()}
                            onDownloadFile={() => this.handleDownloadFile()}
                            onCreateFile={() => this.handleCreateFile()}
                            onCreateDirectory={() => this.handleCreateDirectory()}/>
                        <List
                            onBack={() => this.handleBack()}
                            itemList={this.state.itemList}/>

                        {/* Footer */}
                        <div className="footer-container">
                            <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()}</p>
                        </div>
                    </div>
                    <RightSidebar path={this.path}/>
                </DirectoryInfoContext.Provider>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ this.path;

        // Close the left sidebar if the window width is smaller than 1423px
        if(document.body.clientWidth <= 1423) {
            this.isLsidebarOpen = false;
            this.toggleLsidebar(false);
        }

        // The control buttons is defaultly disabled
        this.setControlButtonsDisabled(true, true, true);

        // document.addEventListener("fileListUpdate", () => this.refreshItemList());
        Emitter.get().on("fileListUpdate", () => this.refreshItemList());

        this.refreshItemList();
        this.refreshStarredList();
    }

    private async refreshItemList(): Promise<void> {
        // Clear the list
        this.setState({
            itemList: <></>
        });

        // Get the info of current directory
        var dirInfo: FetchDirInfoResponse;
        if(!this.context.isDemo) {
            !this.isZipFile
                ? dirInfo = await Axios.get(apiUrl +"/fetchDirInfo?path="+ this.path.replaceAll("/", "\\"))
                : dirInfo = await Axios.get(apiUrl +"/fetchZipInfo?path="+ this.path.replaceAll("/", "\\"));
            
            if(this.isZipFile) Logger.log({ value: "Opened a zip file: " }, dirInfo.data);
        } else if(this.path == "C:/") { // demo (root path)
            dirInfo = {
                data: {
                    list: [
                        {
                            isDirectory: true,
                            isFile: false,
                            fullName: "test"
                        },
                        {
                            isDirectory: false,
                            isFile: true,
                            fullName: "helloworld.txt",
                            format: "txt",
                            size: 90
                        },
                    ]
                }
            };
        } else { // demo (test directory)
            dirInfo = {
                data: {
                    list: []
                }
            };
        }

        if(dirInfo.data.err == 404) {
            toast.error(Utils.$("toast.msg9"));
            return;
        }

        /**
         * Make the directories is before the files
         * 
         * Like:
         * ./dirA
         * ./dirB
         * ./dirC
         * ./fileA.txt
         * ./fileB.txt
         * 
         * @type {DirectoryItem[]}
         */
        var dirItemList = dirInfo.data.list;
        for(let i = dirItemList.length - 1; i >= 0; i--) {
            if(dirItemList[i].isFile) {
                dirItemList = Utils.itemMoveToFirst(i, dirItemList);
            }
        }

        this.setState({
            itemList: (
                <>
                    {
                        dirItemList.length == 0
                            ? <p className="list-message-text">{Utils.$("page.explorer.list.empty")}</p>
                            : dirItemList.map((value, index) => {
                                if(
                                    /^[.|$]/.test(value.fullName) &&
                                    !this.context.config.explorer.displayHiddenFile
                                ) return;

                                return <ListItem
                                    itemType={value.isFile ? ItemType.FILE : ItemType.FOLDER}
                                    itemName={value.fullName}
                                    itemSize={value.size ?? -1}
                                    itemInfo={JSON.stringify(value)}
                                    itemPath={this.path}
                                    disabled={this.isZipFile}
                                    onSelect={(item) => this.handleItemSelect(item)}
                                    onUnselect={(item) => this.handleItemUnselect(item)}
                                    key={index}
                                />;
                        })
                    }
                </>
            ),
            direcotryItems: dirItemList
        });
    }

    private async refreshStarredList(): Promise<void> {
        // Clear the list
        this.setState({
            starredList: <></>
        });

        // Check if the current directory is starred & List all the starred directories
        var list;
        if(!this.context.isDemo) {
            list = new Map((await Axios.get(apiUrl +"/getStarred")).data);
        } else { // demo
            list = new Map([
                [0, "C:/"],
                [1, "C:/test"],
            ]);
        }

        // display the full star if the directory is starred
        var p = false;
        list.forEach((value) => {
            if(p) return;
            if(value == this.path) {
                Utils.getElem("star").setAttribute("active", "true");
                this.isStarred = true;
                p = true;
            }
        });
        if(!p) {
            Utils.getElem("star").setAttribute("active", "false");
            this.isStarred = false;
        }

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
    }

    /**
     * The three params,
     * which is from the left to the right of the ToolButtons (src/client/containers/explorer/ToolButtons.tsx)
     */
    private setControlButtonsDisabled(openBtn: boolean, deleteBtn: boolean, downloadBtn: boolean): void {
        var openButton = document.getElementById("open-file") as HTMLButtonElement,
            deleteButton = document.getElementById("delete-file") as HTMLButtonElement,
            downloadButton = document.getElementById("download-file") as HTMLButtonElement;

        openButton.disabled = openBtn;
        if(!this.context.isDemo) deleteButton.disabled = deleteBtn;
        downloadButton.disabled = downloadBtn;
    }

    private toggleLsidebar(isOn: boolean): void {
        var lsidebar = Utils.getElem("lsidebar");
        lsidebar.classList.toggle("closed");
        lsidebar.style.transition = "width .3s"; // To prevent the transition effect being turned off when the layout initializes
        this.isLsidebarOpen = isOn;
    }
}
