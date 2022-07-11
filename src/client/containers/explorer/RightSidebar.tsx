import React, {
    useState,
    useEffect,
    useRef
} from "react";
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
    cpuUsage: 0,
    upTime: 0
};

const RightSidebar: React.FC<ExplorerRightSidebarProps> = (props) => {
    const [state, setState] = useState<ExplorerRightSidebarState>({ sysInfo: null });
    
    // refs
    const pond = useRef<FilePond>(null);
    const sysInfoDialogBox = useRef<DialogBox>(null);
    const memoryUsageBar = useRef<Bar>(null);
    const CPUUsageBar = useRef<Bar>(null);
    
    useEffect(
        () => {
            const sysInfoWorker = new Worker("../../workers/sysInfo.worker.tsx", { type: "module" });
            sysInfoWorker.postMessage({ type: "getSysInfo", apiUrl });

            sysInfoWorker.onmessage = (e: MessageEvent<SysInfo>) => {
                setState({ sysInfo: e.data });

                if(memoryUsageBar.current && CPUUsageBar.current) { // Update the memory usage bar & cpu usage bar
                    memoryUsageBar.current.setValue(Math.floor(((e.data.memory.total - e.data.memory.free) / e.data.memory.total) * 100));
                    CPUUsageBar.current.setValue(Math.floor(e.data.cpuUsage));
                }
            };
        },
        [] /* <=== This empty array is necessary!! Or the worker instance will be created multiple times */
    );

    var sysInfo = state.sysInfo || defaultSysInfo;
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
                    ref={pond}
                    allowMultiple={true}
                    maxFiles={5}
                    labelIdle="[ 拖放 / 浏览文件 ]"
                    server={apiUrl +"/uploadFile?path="+ props.path.replaceAll("/", "\\")}
                    oninit={() => {
                        console.log("Filepond is ready.", pond.current);
                    }}
                    onprocessfile={() => {
                        Emitter.get().emit("fileListUpdate");
                    }}/>
            </div>
            <div className="right-sidebar-panel system-info-container">
                <ul>
                    <li><b>系统:</b> {sysInfo.system}</li>
                    <li><b>内存:</b> {Math.floor(usedmem * 100) +"%"} (总内存 {(sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)})</li>
                    <li><b>CPU占用:</b> {Math.floor(sysInfo.cpuUsage) +"%"}</li>
                    <li><b>运行时间:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                    <li>
                        <Button variant="secondary" onClick={() => {
                            if(sysInfoDialogBox.current) sysInfoDialogBox.current.setOpen(true);
                        }}>详细信息</Button>
                    </li>
                </ul>
            </div>

            {DialogBox.createDialog("sys-info",
                <DialogBox ref={sysInfoDialogBox} title={"系统信息 ("+ sysInfo.system +")"}>
                    <ul>
                        <li><b>系统版本:</b> {sysInfo.version}</li>
                        <li><b>系统类型:</b> {sysInfo.arch}</li>
                        <li><b>当前用户:</b> {sysInfo.userInfo.username}</li>
                        <li><b>用户文件夹:</b> {sysInfo.userInfo.homedir}</li>
                        <li><b>内存:</b> <Bar ref={memoryUsageBar}/> {Math.floor(usedmem * 100) +"% / "+ (sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)}</li>
                        <li><b>CPU占用:</b> <Bar ref={CPUUsageBar}/> {Math.floor(sysInfo.cpuUsage) +"%"}</li>
                        <li><b>运行时间:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                    </ul>
                </DialogBox>
            )}
        </div>
    );
}

export default RightSidebar;
