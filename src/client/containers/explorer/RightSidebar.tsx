import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { FilePond } from "react-filepond";

import Emitter from "../../utils/emitter";
import DialogBox from "../../components/DialogBox";
import Bar from "../../components/Bar";
import {
    ExplorerRightSidebarProps,
    ExplorerRightSidebarState,
    SysInfo
} from "../../types";
import { version, apiUrl } from "../../global";

const defaultSysInfo: SysInfo = {
    system: "",
    version: "",
    platform: "",
    arch: "",
    userInfo: {
        username: "",
        homedir: ""
    },
    memory: {
        total: 0,
        free: 0
    },
    cpuUsage: "",
    upTime: 0
};

export default class RightSidebar extends Component<ExplorerRightSidebarProps, ExplorerRightSidebarState> {
    // refs
    private pond: FilePond | null = null;
    private sysInfoDialogBox: DialogBox | null = null;
    private memoryUsageBar: Bar | null = null;
    
    public constructor(props: ExplorerRightSidebarProps) {
        super(props);

        this.state = {
            sysInfo: null
        };
    }

    private handleFilepondInit(): void {
        console.log("Filepond is ready.", this.pond);
    }

    private handleUpload(): void {
        Emitter.get().emit("fileListUpdate");
    }

    public render(): ReactElement | null {
        var sysInfo = this.state.sysInfo || defaultSysInfo;
        var usedmem = (sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total;

        var utHour = Math.floor(sysInfo.upTime / 60 / 60);
        var utMinute = Math.floor(sysInfo.upTime / 60) - utHour * 60;
        var utSecond = Math.floor(sysInfo.upTime - utMinute * 60 - utHour * 60 * 60);

        return (
            <div className="sidebar-right-container">
                <div className="right-sidebar-panel about-container">
                    <p><b>Ferrum 文件管理器</b> 是一个用React + Typescript写的基于Web的文件资源管理器，可用于服务器等的文件管理</p>
                    <p><a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">https://github.com/NriotHrreion/ferrum</a></p>
                    <p>
                        <object
                            data="https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?style=social&label=Star"
                            aria-label="Github Stars"></object>
                        <a href="/license">许可</a>
                        <span>Ver: {version}</span>
                    </p>
                </div>
                <div className="right-sidebar-panel upload-container">
                    <p>拖放或浏览文件（最多5个）以上传至当前文件夹</p>
                    <FilePond
                        ref={(ref) => {this.pond = ref}}
                        allowMultiple={true}
                        maxFiles={5}
                        labelIdle="[ 拖放 / 浏览文件 ]"
                        server={apiUrl +"/uploadFile?path="+ this.props.path.replaceAll("/", "\\")}
                        oninit={() => this.handleFilepondInit()}
                        onprocessfile={() => this.handleUpload()}/>
                </div>
                <div className="right-sidebar-panel system-info-container">
                    <ul>
                        <li><b>系统:</b> {sysInfo.system}</li>
                        <li><b>内存:</b> {Math.floor(usedmem * 100) +"%"} (总内存 {(sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)})</li>
                        <li><b>CPU占用:</b> {sysInfo.cpuUsage}</li>
                        <li><b>运行时间:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                        <li>
                            <Button variant="secondary" onClick={() => {
                                if(this.sysInfoDialogBox) this.sysInfoDialogBox.setOpen(true);
                            }}>详细信息</Button>
                        </li>
                    </ul>
                </div>
                <DialogBox ref={(r) => this.sysInfoDialogBox = r} title={"系统信息 ("+ sysInfo.system +")"}>
                    <ul>
                        <li><b>系统版本:</b> {sysInfo.version}</li>
                        <li><b>系统类型:</b> {sysInfo.arch}</li>
                        <li><b>当前用户:</b> {sysInfo.userInfo.username}</li>
                        <li><b>用户文件夹:</b> {sysInfo.userInfo.homedir}</li>
                        {/* <li><b>内存:</b> {Math.floor(usedmem * 100) +"%"} (总内存 {(sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)})</li> */}
                        <li><b>内存:</b> <Bar ref={(r) => this.memoryUsageBar = r}/> {Math.floor(usedmem * 100) +"% / "+ (sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)}</li>
                        <li><b>CPU占用:</b> {sysInfo.cpuUsage}</li>
                        <li><b>运行时间:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                    </ul>
                </DialogBox>
            </div>
        );
    }

    public async componentDidMount(): Promise<any> {
        const sysInfoWorker = new Worker("../../workers/sysInfo.worker.tsx", {type: "module"});
        sysInfoWorker.postMessage({type: "getSysInfo", apiUrl});

        sysInfoWorker.onmessage = (e: MessageEvent<SysInfo>) => {
            this.setState({
                sysInfo: e.data
            });

            if(this.memoryUsageBar) { // Update the memory usage bar
                this.memoryUsageBar.setValue(Math.floor(((e.data.memory.total - e.data.memory.free) / e.data.memory.total) * 100));
            }
        };
    }
}
