const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../../config.json");

module.exports = function(req, res) {
    var config = JSON.parse(fs.readFileSync(configPath));
    if(req.body.oldPassword !== config.explorer.password) {
        res.end(JSON.stringify({err: 403}));
        return;
    }

    config.explorer.password = req.body.newPassword;
    fs.writeFileSync(configPath, JSON.stringify(config, undefined, "    "));

    res.end();
};
