const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var dirPath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(dirPath)) {
        res.end(JSON.stringify({list: [], err: 404}));
        return;
    }
    
    var dir = fs.readdirSync(dirPath);
    var infoList = [];

    for(let i in dir) {
        try {
            var stat = fs.statSync(path.join(dirPath, dir[i]));
            infoList.push({
                isDirectory: stat.isDirectory(),
                isFile: stat.isFile(),
                fullName: dir[i],
                format: stat.isFile() ? dir[i].split(".")[1] : undefined,
                size: stat.isFile() ? stat.size : undefined
            });
        } catch (e) {
            // Do nothing
        }
    }

    res.end(JSON.stringify({
        list: infoList,
        err: 0
    }));
};
