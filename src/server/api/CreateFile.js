const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var dirPath = req.body.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(dirPath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    var fileName = req.body.fileName;
    fs.writeFileSync(path.join(dirPath, fileName), "");

    res.end();
};
