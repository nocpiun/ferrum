const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var dirPath = req.body.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(dirPath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    var dirName = req.body.dirName;
    fs.mkdirSync(path.join(dirPath, dirName));

    res.end();
};
