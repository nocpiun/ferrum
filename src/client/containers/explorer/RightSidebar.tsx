import { Component, ReactElement } from "react";
import { FilePond } from "react-filepond";
import Axios from "axios";

import AlertBox from "../../components/AlertBox";
import {
    ExplorerRightSidebarProps,
    ExplorerRightSidebarState,
    FetchSysInfoResponse
} from "../../types";
import Emitter from "../../emitter";

const apiUrl = "http://"+ window.location.hostname +":3301";

export default class RightSidebar extends Component<ExplorerRightSidebarProps, ExplorerRightSidebarState> {
    private pond: FilePond | null = null;
    
    public constructor(props: ExplorerRightSidebarProps) {
        super(props);

        this.state = {
            alertBox1: true,
            alertBox2: false,
            alertBox3: true,
            sysInfo: null
        };
    }

    private handleFilepondInit(): void {
        console.log("Filepond is ready.", this.pond);
    }

    public render(): ReactElement | null {
        if(!this.state.sysInfo) return null;
        var sysInfo = this.state.sysInfo;
        var usedmem = (sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total;

        return (
            <div className="sidebar-right-container">
                <AlertBox
                    variant="primary"
                    heading="关于"
                    style={{display: this.state.alertBox1 ? "block" : "none"}}
                    alertId={1}
                >
                    <b>Ferrum 文件管理器</b> 是一个用React + Typescript写的基于Web的文件资源管理器，可用于服务器等的文件管理
                    <br/>
                    <a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">https://github.com/NriotHrreion/ferrum</a>
                </AlertBox>
                <AlertBox
                    variant="success"
                    heading="文件上传"
                    style={{display: this.state.alertBox2 ? "block" : "none"}}
                    alertId={2}
                >
                    <p>拖放或浏览文件（最多5个）以上传至当前文件夹</p>
                    <FilePond
                        ref={(ref) => {this.pond = ref}}
                        allowMultiple={true}
                        maxFiles={5}
                        labelIdle="拖放 / 浏览文件"
                        server={apiUrl +"/uploadFile?path="+ this.props.path.replaceAll("/", "\\")}
                        oninit={() => this.handleFilepondInit()}/>
                </AlertBox>
                <AlertBox
                    variant="warning"
                    heading="系统信息"
                    style={{display: this.state.alertBox3 ? "block" : "none"}}
                    alertId={3}
                >
                    <ul>
                        <li>系统: {sysInfo.system}</li>
                        <li>系统版本: {sysInfo.version}</li>
                        <li>系统类型: {sysInfo.arch}</li>
                        <li>当前用户: {sysInfo.userInfo.username}</li>
                        <li>用户文件夹: {sysInfo.userInfo.homedir}</li>
                        <li>内存: {Math.floor(usedmem * 100) +"%"} (总内存 {(sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)})</li>
                        <li>CPU占用: {sysInfo.cpuUsage}</li>
                    </ul>
                </AlertBox>
            </div>
        );
    }

    public async componentDidMount(): Promise<any> {
        Emitter.get().on("displayAlert", (id: number) => {
            switch(id) {
                case 1:
                    this.setState({alertBox1: true});
                    break;
                case 2:
                    this.setState({alertBox2: true});
                    break;
                case 3:
                    this.setState({alertBox3: true});
            }
        });
        Emitter.get().on("closeAlert", (id: number) => {
            switch(id) {
                case 1:
                    this.setState({alertBox1: false});
                    break;
                case 2:
                    this.setState({alertBox2: false});
                    break;
                case 3:
                    this.setState({alertBox3: false});
                    break;
            }
        });

        this.getSysInfo();
        setInterval(async () => this.getSysInfo(), 3000);
    }

    private async getSysInfo(): Promise<void> {
        var sysInfoData = (await Axios.get(apiUrl +"/fetchSysInfo") as FetchSysInfoResponse).data;

        this.setState({
            sysInfo: sysInfoData
        });
    }
}
