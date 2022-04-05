const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const logger = require("nriot-logger");

// init config
require("./InitConfig");

// api router
const router = require("./Route");

// Hitokoto
const hitokotoApiUrl = "https://v1.hitokoto.cn/?c=i&encode=json";

axios.default.get(hitokotoApiUrl, {responseType: "json"})
    .then((res) => {
        logger.info(
            "Hitokoto:\n\n"+
            " "+ chalk.bold(res.data.hitokoto) +"\n"+
            "            " + chalk.yellowBright("————"+ res.data.from_who +"《"+ res.data.from +"》") + "\n"
        );
    })
    .catch((err) => {throw err});

var app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(bodyParser.urlencoded({extended: false}));

// app.get("/*", (req, res, next) => {
//     logger.info(`Receive a ${chalk.cyan("GET")} request: ${chalk.blue(JSON.stringify(req.query))}`);
//     next();
// });
// app.post("/*", (req, res, next) => {
//     logger.info(`Receive a ${chalk.cyan("POST")} request: ${chalk.yellow(JSON.stringify(req.body))}`);
//     next();
// });

app = router(app);

// listen & launch
app.listen(3301, () => {
    logger.info("Backend Server is ready. Port: "+ chalk.cyan("3301"));
});

// socket connect
require("./SocketConn");
