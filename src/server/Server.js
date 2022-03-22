const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const logger = require("nriot-logger");

// apis
const fetchDirInfoApi = require("./api/FetchDirInfo");
const getStarredApi = require("./api/GetStarred");
const addStarredApi = require("./api/AddStarred");
const deleteStarredApi = require("./api/DeleteStarred");
const getFileDataApi = require("./api/GetFileData");
const getFileContentApi = require("./api/GetFileContent");
const saveFileContentApi = require("./api/SaveFileContent");
const deleteFileApi = require("./api/DeleteFile");
const uploadFileApi = require("./api/UploadFile");

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/*", (req, res, next) => {
    logger.info(`Receive a ${chalk.cyan("GET")} request: ${chalk.blue(JSON.stringify(req.query))}`);
    next();
});
app.post("/*", (req, res, next) => {
    logger.info(`Receive a ${chalk.cyan("POST")} request: ${chalk.yellow(JSON.stringify(req.body))}`);
    next();
});

// routes
app.get("/fetchDirInfo", (req, res) => fetchDirInfoApi(req, res));
app.get("/getStarred", (req, res) => getStarredApi(req, res));
app.post("/addStarred", (req, res) => addStarredApi(req, res));
app.post("/deleteStarred", (req, res) => deleteStarredApi(req, res));
app.get("/getFileData", (req, res) => getFileDataApi(req, res));
app.get("/getFileContent", (req, res) => getFileContentApi(req, res));
app.post("/saveFileContent", (req, res) => saveFileContentApi(req, res));
app.post("/deleteFile", (req, res) => deleteFileApi(req, res));
app.post("/uploadFile", multer({dest: "upload_tmp/"}).any(), (req, res) => uploadFileApi(req, res));

// listen & launch
app.listen(3001, () => {
    logger.info("Backend Server is ready. Port: "+ chalk.cyan("3001"));
});
