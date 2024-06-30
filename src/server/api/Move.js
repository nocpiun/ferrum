const fs = require("fs");

module.exports = function(req, res) {
    // Absolute Paths
    var oldPath = req.body.oldPath.replace(/\\/g, "/"),
        newPath = req.body.newPath.replace(/\\/g, "/");
    if(!fs.existsSync(oldPath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    fs.renameSync(oldPath, newPath);

    res.end();
}
