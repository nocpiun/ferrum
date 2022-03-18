const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("nriot-logger");

// apis
const fetchDirInfoApi = require("./api/FetchDirInfo");
const getStarredApi = require("./api/GetStarred");
const addStarredApi = require("./api/AddStarred");
const getFileDataApi = require("./api/GetFileData");

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.get("/fetchDirInfo", (req, res) => fetchDirInfoApi(req, res));
app.get("/getStarred", (req, res) => getStarredApi(req, res));
app.post("/addStarred", (req, res) => addStarredApi(req, res));
app.get("/getFileData", (req, res) => getFileDataApi(req, res));

// listen & launch
app.listen(3001, () => {
    logger.info("Backend Server is ready. Port: "+ chalk.cyan("3001"));
});
