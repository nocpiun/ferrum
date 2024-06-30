import express from "express";
import compression from "compression";
import chalk from "chalk";
import path from "path";
import url from "url";
import fs from "fs/promises";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/icon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "icon.png"));
});

app.listen(3300, async () => {
    const { version } = JSON.parse(
        await fs.readFile(path.join(__dirname, "package.json"))
    );
    console.log(chalk.green("Ferrum Explorer (v"+ version +") started on port 3300"));
});
