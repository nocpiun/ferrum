const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../../config.json");

module.exports = function(req, res) {
    var config = req.body.config;
    fs.writeFileSync(configPath, JSON.stringify(config, undefined, "    "));

    res.end();
};
