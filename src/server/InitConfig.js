const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.js");

const defaultConfigContent = `export default {
    explorer: {
        root: "C:"
    },
    editor: {
        theme: "csb-github",
        lineNumber: false
    },
    terminal: {
        ip: "0.0.0.0",
        port: 22,
        username: "root",
        password: "123456"
    }
}`;

if(!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, defaultConfigContent);
}
