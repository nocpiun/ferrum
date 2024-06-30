const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

/**
 * The default password is 123456
 */

const defaultConfigContent = `{
    "explorer": {
        "root": "C:",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "displayHiddenFile": true
    },
    "editor": {
        "lineNumber": true,
        "autoWrap": false,
        "highlightActiveLine": true,
        "fontSize": 14
    },
    "terminal": {
        "ip": "0.0.0.0",
        "port": 22,
        "username": "root",
        "password": "123456"
    }
}`;

if(!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, defaultConfigContent);
}
