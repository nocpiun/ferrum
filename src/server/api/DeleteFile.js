const fs = require("fs");
const path = require("path");

function clearDir(dirPath) {
    var dir = fs.readdirSync(dirPath);
    if(dir.length == 0) {
        fs.rmdirSync(dirPath);
        return;
    }

    dir.forEach((value, index) => {
        var _path = path.join(dirPath, value);
        var _stat = fs.statSync(_path);
        
        if(_stat.isFile()) {
            fs.unlinkSync(_path);
        } else {
            clearDir(_path);
        }
    });

    fs.rmdirSync(dirPath);
}

module.exports = function(req, res) {
    var specifiedPath = req.body.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(specifiedPath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    var stat = fs.statSync(specifiedPath);
    if(stat.isFile()) {
        fs.unlinkSync(specifiedPath);
    } else {
        clearDir(specifiedPath);
    }

    res.end();
}
