/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import openSocket from "socket.io-client";
import { Terminal as XTermTerminal } from "xterm";

import { hostname } from "../global";
import Utils from "../../Utils";
import * as config from "../../config.json";

const ip = hostname +":3302";
const socket = openSocket(ip, {
    extraHeaders: {"Access-Control-Allow-Origin": "*"}
});

const Terminal: React.FC = () => {
    var term: XTermTerminal;

    useEffect(() => {
        term = new XTermTerminal({ cursorBlink: true });
        term.open(Utils.getElem("xterm"));

        if(config.terminal.ip == "0.0.0.0") {
            term.write("使用终端之前, 你需要在'src/config.js'中配置ssh服务器信息.");
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

        term.onData((data) => {
            socket.emit("t1", data);
        });

        socket.on(msgId, (data) => {
            console.log(data);
            if(term) term.write(data);
        });
    }, []);

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

export default Terminal;
