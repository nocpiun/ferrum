const express = require("express");
const cors = require("cors");

var app = express();
app.use(cors({origin: "*"}));

const http = require("http").Server(app);
const io = require("socket.io")(http, {cors: true});
const utf8 = require("utf8");
const SSHClient = require("ssh2").Client;
const chalk = require("chalk");
const logger = require("nriot-logger");

io.on("connection", (socket) => {
    socket.on("createNewServer", (e) => {
        logger.info("socket: connected, "+ e.ip);

        var ssh = new SSHClient();
        
        try {
            ssh.on("ready", () => {
                socket.emit(e.msgId, '\r\n***' + e.ip + ' SSH CONNECTION ESTABLISHED ***\r\n');
                ssh.shell((err, stream) => {
                    if(err) socket.emit(e.msgId, '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
    
                    socket.on(e.msgId, (data) => {
                        stream.write(data);
                    });
    
                    stream.on("data", (data) => {
                        socket.emit(e.msgId, utf8.decode(data.toString("binary")));
                    }).on("close", () => {
                        ssh.end();
                    });
                });
            }).on("close", () => {
                socket.emit(e.msgId, '\r\n*** SSH CONNECTION CLOSED ***\r\n');
            }).on("error", (err) => {
                socket.emit(e.msgId, '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
            }).connect({
                host: e.ip.split(":")[0],
                port: e.ip.split(":")[1],
                username: e.username,
                password: e.password
            });
        } catch(e) {
            // do nothing...
        }
    });

    socket.on("disconnect", () => {
        logger.info("socket: disconnected");
    });
});

http.listen(3302, () => {
    logger.info("Socket Server is ready. Port: "+ chalk.cyan(3302));
});
