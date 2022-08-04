/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import openSocket from "socket.io-client";
import { Terminal as XTermTerminal } from "xterm";

import MainContext from "../contexts/MainContext";

import { hostname } from "../global";
import Utils from "../../Utils";
// import * as config from "../../config.json";

const Terminal: React.FC = () => {
    const { config } = useContext(MainContext);

    const ip = hostname +":3302";
    const socket = openSocket(ip, {
        extraHeaders: {"Access-Control-Allow-Origin": "*"}
    });

    var term: XTermTerminal;

    useEffect(() => {
        term = new XTermTerminal({ cursorBlink: true });
        term.open(Utils.getElem("xterm"));

        if(config.terminal.ip == "0.0.0.0") {
            term.write(Utils.$("page.terminal.nocfg"));
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
                    <h1>{Utils.$("page.terminal.title")}</h1>
                </div>
                <div className="xterm-container" id="xterm"></div>
            </div>
        </div>
    );
}

export default Terminal;
