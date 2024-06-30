/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useContext,
    useEffect,
    useRef
} from "react";
import { Button } from "react-bootstrap";
import { FilePond } from "react-filepond";

import MainContext from "../../contexts/MainContext";
import RightSidebarPanel from "./RightSidebarPanel";

import Emitter from "../../utils/emitter";
import Logger from "../../utils/logger";
import DialogBox from "../../components/DialogBox";
import Bar from "../../components/Bar";
import Sash from "../../components/Sash";
import Utils from "../../../Utils";
import {
    ExplorerRightSidebarProps,
    ExplorerRightSidebarState,
    SysInfo
} from "../../types";
import { version, apiUrl } from "../../global";

const defaultSysInfo: SysInfo = {
    system: "Ferrum-DEMO",
    version,
    platform: "-",
    arch: "-",
    userInfo: {
        username: "user",
        homedir: "-"
    },
    memory: {
        total: 100,
        free: 40
    },
    cpuUsage: 13,
    upTime: 0,
    diskInfo: [{
        filesystem: "",
        blocks: 0,
        used: 122958471233536,
        available: 83179557879808,
        capacity: "60%",
        mounted: "C:"
    }]
};

const RightSidebar: React.FC<ExplorerRightSidebarProps> = (props) => {
    const defaultWidth = 380;

    const [state, setState] = useState<ExplorerRightSidebarState>({ sysInfo: null });
    const [width, setWidth] = useState(defaultWidth);
    const rsidebar = useRef<HTMLDivElement | null>(null);
    const { isDemo } = useContext(MainContext);
    
    // refs
    const pond = useRef<FilePond>(null);
    const sysInfoDialogBox = useRef<DialogBox>(null);
    const diskInfoDialogBox = useRef<DialogBox>(null);
    
    useEffect(
        () => {
            const sysInfoWorker = new Worker("../../workers/sysInfo.worker.tsx", { type: "module" });
            sysInfoWorker.postMessage({ type: "getSysInfo", apiUrl });

            sysInfoWorker.onmessage = (e: MessageEvent<SysInfo>) => {
                setState({ sysInfo: e.data });
            };
        },
        [] /* <=== This empty array is necessary!! Or the worker instance will be created multiple times */
    );

    var sysInfo = state.sysInfo || defaultSysInfo;
    var usedmem = (sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total;

    var utHour = Math.floor(sysInfo.upTime / 60 / 60);
    var utMinute = Math.floor(sysInfo.upTime / 60) - utHour * 60;
    var utSecond = Math.floor(sysInfo.upTime - utMinute * 60 - utHour * 60 * 60);

    var disks = sysInfo.diskInfo;

    return (
        <aside className="sidebar-right-container" id="rsidebar" style={{ width: width +"px" }} ref={rsidebar}>
            <Sash
                defaultWidth={defaultWidth}
                min={270}
                max={700}
                position="left"
                onResize={(w) => setWidth(w)}
                ref={rsidebar}>
            {/* About */}
            <RightSidebarPanel id="about">
                <p>
                    <object
                        data="https://img.shields.io/github/stars/nocpiun/ferrum.svg?style=social&label=Star"
                        aria-label="Github Stars"></object>
                    <a href="/license">{Utils.$("page.explorer.right.license")}</a>
                    <span>Ver: {version}</span>
                </p>
            </RightSidebarPanel>
            {/* Upload */}
            <RightSidebarPanel title={Utils.$("page.explorer.right.upload")} id="upload">
                <p>{Utils.$("page.explorer.right.upload.note")}</p>
                <FilePond
                    disabled={isDemo}
                    ref={pond}
                    allowMultiple={true}
                    maxFiles={5}
                    labelIdle={Utils.$("page.explorer.right.upload.placeholder")}
                    server={apiUrl +"/uploadFile?path="+ props.path.replaceAll("/", "\\")}
                    oninit={() => {
                        Logger.log({ value: "Filepond is ready." }, pond.current);
                    }}
                    onprocessfile={() => {
                        Emitter.get().emit("fileListUpdate");
                    }}/>
            </RightSidebarPanel>
            {/* System Info */}
            <RightSidebarPanel title={Utils.$("page.explorer.right.sysinfo")} id="system-info">
                <ul>
                    <li><b>{Utils.$("sysinfo.system")}:</b> {sysInfo.system}</li>
                    <li><b>{Utils.$("sysinfo.memory")}:</b> {Math.floor(usedmem * 100) +"%"} ({Utils.$("sysinfo.memory.total")} {Utils.BToG(sysInfo.memory.total)} GB)</li>
                    <li><b>{Utils.$("sysinfo.cpu")}:</b> {Math.floor(sysInfo.cpuUsage) +"%"}</li>
                    <li><b>{Utils.$("sysinfo.uptime")}:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                    <li><b>{Utils.$("sysinfo.disks")}:</b> {disks.map((disk, i) => (<span key={i}>{disk.mounted}</span>))}</li>
                    <li>
                        <Button variant="secondary" onClick={() => {
                            if(sysInfoDialogBox.current) sysInfoDialogBox.current.setOpen(true);
                        }}>{Utils.$("page.explorer.right.sysinfo.details")}</Button>
                    </li>
                    <li>
                        <Button variant="secondary" onClick={() => {
                            if(diskInfoDialogBox.current) diskInfoDialogBox.current.setOpen(true);
                        }}>{Utils.$("page.explorer.right.sysinfo.diskinfo")}</Button>
                    </li>
                </ul>
            </RightSidebarPanel>
            </Sash>

            {DialogBox.createDialog("sys-info",
                <DialogBox ref={sysInfoDialogBox} id="sys-info" title={Utils.$("sysinfo") +" ("+ sysInfo.system +")"}>
                    <div className="sys-info-dialog">
                        <ul>
                            <li>
                                <b>{Utils.$("sysinfo.version")}:</b>
                                <span>{sysInfo.version}</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.arch")}:</b>
                                <span>{sysInfo.arch}</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.user.name")}:</b>
                                <span>{sysInfo.userInfo.username}</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.user.home")}:</b>
                                <span>{sysInfo.userInfo.homedir}</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.memory")}:</b>
                                <span><Bar value={Math.floor(((sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total) * 100)}/> {Math.floor(usedmem * 100) +"% / "+ Utils.BToG(sysInfo.memory.total)} (GB)</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.cpu")}:</b>
                                <span><Bar value={Math.floor(sysInfo.cpuUsage)}/> {Math.floor(sysInfo.cpuUsage) +"%"}</span>
                            </li>
                            <li>
                                <b>{Utils.$("sysinfo.uptime")}:</b>
                                <span>{(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</span>
                            </li>
                        </ul>
                    </div>
                </DialogBox>
            )}

            {DialogBox.createDialog("disk-info",
                <DialogBox ref={diskInfoDialogBox} id="disk-info" title={Utils.$("page.explorer.right.sysinfo.diskinfo")}>
                    <div className="disk-info-dialog">
                        <ul>{disks.map((disk, i) => {
                            return (
                                <li key={i}>
                                    <b>{disk.mounted}</b>
                                    <span><Bar value={parseInt(disks[i].capacity)}/> {disks[i].capacity} {Utils.BToG(disks[i].used) +" / "+ Utils.BToG(disks[i].used + disk.available)} (GB)</span>
                                </li>
                            );
                        })}</ul>
                    </div>
                </DialogBox>
            )}
        </aside>
    );
}

export default RightSidebar;
