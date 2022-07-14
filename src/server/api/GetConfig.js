const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../../config.json");

module.exports = function(req, res) {
    res.end(JSON.stringify({
        config: JSON.parse(fs.readFileSync(configPath)),
        err: 0
    }));
};
