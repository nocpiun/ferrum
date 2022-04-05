import { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

// components
import ListItem from "../components/ListItem";
import StarredItem from "../components/StarredItem";

// containers
import Header from "../containers/explorer/Header";
import ToolButtons from "../containers/explorer/ToolButtons";
import List from "../containers/explorer/List";
import LeftSidebar from "../containers/explorer/LeftSidebar";
import RightSidebar from "../containers/explorer/RightSidebar";

import Utils from "../../Utils";
import { FetchDirInfoResponse, ExplorerProps, ExplorerState } from "../types";
import Emitter from "../emitter";
import config from "../../config.json";
import { plugins } from "../../plugins";

// icons
import starRate from "../../icons/star_rate.svg";
import md5 from "md5-node";

export const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3301";
const root = config.explorer.root;

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
        this.path = root + this.props.path;
    }

    /**
     * Back to the parent directory
     */
    private handleBack(): void {
        if(this.path == root +"/") {
            toast.error("你在根目录，无法进入上级目录");
            return;
        }

        var pathArr = this.path.split("/");
        var newPath = "";
        for(let i = 1; i < pathArr.length - 1; i++) {
            newPath += "/"+ pathArr[i];
        }
        window.location.href = hostname +":3300/dir"+ newPath;
    }

    /**
     * Enter the directory that is entered by user in the textarea
     */
    private handleEnter(e: React.KeyboardEvent): void {
        if(e.key == "Enter") {
            var elem = e.target as HTMLInputElement;
            window.location.href = hostname +":3300/dir"+ elem.value.replace(root, "");
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

    private handleSetPassword(): void {
        // The string `oldPassword` has been md5,
        // but the string `newPassword` hasn't yet
        // If you want to compare the two strings,
        // you need to md5(newPassword) first

        var oldPassword = md5(prompt("请输入当前密码") || "");
        if(oldPassword !== config.explorer.password) {
            toast.error("密码输入错误");
            return;
        }

        var newPassword = prompt("请输入新密码");
        if(!newPassword) {
            toast.error("密码更改失败, 请输入有效密码");
            return;
        }

        if(md5(newPassword) === oldPassword) {
            toast.error("密码更改失败, 新密码与旧密码不能相同");
            return;
        }

        if(prompt("请再次输入新密码") === newPassword) {
            Utils.setCookie("fepw", md5(md5(newPassword)));
            toast.promise(Axios.post(apiUrl +"/setPassword", {
                oldPassword,
                newPassword: md5(newPassword)
            }), {
                loading: "更改中...",
                success: "更改成功",
                error: "更改失败"
            }).then(() => window.location.reload());
        } else {
            toast.error("密码更改失败, 前后输入的新密码不一致");
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
            this.setControlButtonsDisabled(false, false, false);
        } else {
            this.setControlButtonsDisabled(false, false, true);
        }
    }

    /**
     * Unselect item
     */
    private handleItemUnselect(): void {
        this.setState({
            itemSelected: null
        });
        this.setControlButtonsDisabled(true, true, true);
    }

    private handleOpenFile(): void {
        if(this.state.itemSelected == null) return;

        var itemFullName = this.state.itemSelected.fullName;
        var itemFormat = this.state.itemSelected.format;
        var itemPath = (this.path.replace(root, "") +"/"+ itemFullName).replaceAll("/", "\\");

        if(this.state.itemSelected.isFile && itemFormat) {
            if(Utils.formatTester(["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff", "ico"], itemFormat)) {
                window.location.href = hostname +":3300/picture/?path="+ itemPath;
                return;
            }

            for(let i = 0; i < plugins.length; i++) {
                if(Utils.formatTester(plugins[i].format, itemFormat)) {
                    window.location.href = hostname +":3300"+ plugins[i].route +"/?path="+ itemPath;
                    return;
                }
                console.log(plugins[i].format, itemFormat);
            }

            window.location.href = hostname +":3300/edit/?path="+ itemPath;
            return;
        }

        if(this.state.itemSelected.isFile && !itemFormat) {
            window.location.href = hostname +":3300/edit/?path="+ itemPath;
            return;
        }

        window.location.href += "/"+ itemFullName;
    }
    
    private handleDeleteFile(): void {
        if(this.state.itemSelected == null) return;

        toast.promise(Axios.post(apiUrl +"/deleteFile", {
            path: (this.path +"/"+ this.state.itemSelected.fullName).replaceAll("/", "\\")
        }), {
            loading: "加载中...",
            success: "删除成功",
            error: "删除失败"
        }).then(() => window.location.reload());
    }
    
    private handleDownloadFile(): void {
        if(this.state.itemSelected == null) return;

        if(this.state.itemSelected.isFile) {
            window.location.href = hostname +":3001/getFileData?path="+ (this.path +"/"+ this.state.itemSelected.fullName).replaceAll("/", "\\");
        }
    }
    
    private handleUploadFile(): void {
        Emitter.get().emit("displayAlert", 2); // Open uploader
    }
    
    private async handleCreateFile(): Promise<void> {
        const newFileName = "新建文本文档";
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
            loading: "创建中...",
            success: "创建成功",
            error: "创建失败"
        }).then(() => window.location.reload());
    }

    private async handleCreateDirectory(): Promise<void> {
        const newDirName = "新建文件夹";
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
            loading: "创建中...",
            success: "创建成功",
            error: "创建失败"
        }).then(() => window.location.reload());
    }

    public render(): ReactElement {
        return (
            <div className="explorer">
                <div className="toast-container">
                    <Toaster position="bottom-right"/>
                </div>
                <div className="main-container" id="main">
                    <Header
                        path={this.path}
                        onEnter={(e) => this.handleEnter(e)}
                        onStar={() => this.handleStar()}
                        onSetPassword={() => this.handleSetPassword()}/>
                    <ToolButtons
                        onOpenFile={() => this.handleOpenFile()}
                        onDeleteFile={() => this.handleDeleteFile()}
                        onDownloadFile={() => this.handleDownloadFile()}
                        onUploadFile={() => this.handleUploadFile()}
                        onCreateFile={() => this.handleCreateFile()}
                        onCreateDirectory={() => this.handleCreateDirectory()}/>
                    <List
                        onBack={() => this.handleBack()}
                        itemList={this.state.itemList}/>

                    <div className="footer-container">
                        <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()} - <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => Emitter.get().emit("displayAlert", 1)}>关于</span></p>
                    </div>
                </div>
                <LeftSidebar starredList={this.state.starredList}/>
                <RightSidebar path={this.path}/>
            </div>
        );
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Ferrum - "+ this.path;

        // The control buttons is defaultly disabled
        this.setControlButtonsDisabled(true, true, true);

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
        var dirInfo: FetchDirInfoResponse = await Axios.get(apiUrl +"/fetchDirInfo?path="+ this.path.replaceAll("/", "\\"));

        if(dirInfo.data.err == 404) {
            toast.error("无法找到指定文件夹");
            return;
        }

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
                        dirItemList.map((value, index) => {
                            return <ListItem
                                itemType={value.isFile ? "file" : "folder"}
                                itemName={value.fullName}
                                itemSize={value.size ? value.size : -1}
                                itemInfo={JSON.stringify(value)}
                                itemPath={this.path}
                                onClick={(e) => this.handleItemSelect(e)}
                                key={index}
                            />;
                        })
                    }
                </>
            )
        });
        
        // Check if the current directory is starred & List all the starred directories
        var starList = await Axios.get(apiUrl +"/getStarred");

        var list = new Map(starList.data);
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
    }

    private setControlButtonsDisabled(openBtn: boolean, deleteBtn: boolean, downloadBtn: boolean): void {
        var openButton = document.getElementById("open-file") as HTMLButtonElement,
            deleteButton = document.getElementById("delete-file") as HTMLButtonElement,
            downloadButton = document.getElementById("download-file") as HTMLButtonElement;

        openButton.disabled = openBtn;
        deleteButton.disabled = deleteBtn;
        downloadButton.disabled = downloadBtn;
    }
}
