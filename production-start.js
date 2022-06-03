const express = require("express");
const compression = require("compression");
const chalk = require("chalk");
const path = require("path");

var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/icon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "icon.png"));
});

app.listen(3300, () => {
    console.log(chalk.green("Ferrum Explorer started on port 3300"));
});
