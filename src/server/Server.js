// import fs from "fs";
// import path from "path";

// import chalk from "chalk";
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import logger from "nriot-logger";

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("nriot-logger");

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/fetchDirInfo", (req, res) => {
    var dirPath = new Buffer(req.query.path, "base64").toString(); // Absolute Path
    if(!fs.existsSync(dirPath)) {
        res.end(JSON.stringify({list: [], err: 404}));
        return;
    }
    
    var dir = fs.readdirSync(dirPath);
    var infoList = [];

    for(let i in dir) {
        try {
            var stat = fs.statSync(path.join(dirPath, dir[i]));
            infoList.push({
                isDirectory: stat.isDirectory(),
                isFile: stat.isFile(),
                fullName: dir[i],
                format: stat.isFile() ? dir[i].split(".")[1] : undefined,
                size: stat.isFile() ? stat.size : undefined
            });
        } catch (e) {
            // Do nothing
        }
    }

    res.end(JSON.stringify({
        list: infoList
    }));
});

app.listen(3001, () => {
    logger.info("Backend Server is ready. Port: 3001");
    logger.info("Ferrum Explorer has been opened on "+ chalk.green("https://localhost:3000"));
});
