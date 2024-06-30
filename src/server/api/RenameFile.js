const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var newName = req.body.newName;
    var specifiedPath = req.body.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(specifiedPath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    fs.renameSync(specifiedPath, path.join(specifiedPath.replace(path.basename(specifiedPath), ""), newName));
    res.end();
};
