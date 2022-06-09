import { Component, ReactElement } from "react";
import openSocket from "socket.io-client";
import { Terminal as XTermTerminal } from "xterm";

import { hostname } from "../global";
import Utils from "../../Utils";
import * as config from "../../config.json";

const ip = hostname +":3302";
const socket = openSocket(ip, {
    extraHeaders: {"Access-Control-Allow-Origin": "*"}
});

export default class Terminal extends Component {
    private term: XTermTerminal | null = null;

    public render(): ReactElement {
        return (
            <div className="terminal">
                <div className="main-container">
                    <div className="header-container">
                        <h1>Ferrum 终端</h1>
                    </div>
                    <div className="xterm-container" id="xterm"></div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this.term = new XTermTerminal({cursorBlink: true});
        this.term.open(Utils.getElem("xterm"));

        if(config.terminal.ip == "0.0.0.0") {
            this.term.write("使用终端之前, 你需要在'src/config.js'中配置ssh服务器信息.");
            return;
        }

        var serverIp = config.terminal.ip +":"+ config.terminal.port;
        var username = config.terminal.username;
        var password = config.terminal.password;

        const msgId = "t1";

        socket.emit("createNewServer", {
            msgId,
            ip: serverIp,
            username,
            password
        });

        this.term.onData((data) => {
            socket.emit("t1", data);
        });

        socket.on(msgId, (data) => {
            console.log(data);
            if(this.term) this.term.write(data);
        });
    }
}
