const fs = require("fs");
const path = require("path");
const StreamZip = require("node-stream-zip");

module.exports = function(req, res) {
    var zipPath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(zipPath)) {
        res.end(JSON.stringify({list: [], err: 404}));
        return;
    }

    var zip = new StreamZip({ file: zipPath });
    var infoList = [];

    zip.on("ready", () => {
        var entries = Object.values(zip.entries());
        for(let i in entries) {
            var entry = entries[i];
    
            infoList.push({
                isDirectory: entry.isDirectory,
                isFile: entry.isFile,
                fullName: entry.name,
                format: entry.isFile ? path.extname(entry.name).replace(".", "") : undefined,
                size: entry.isFile ? entry.size : undefined
            });
        }

        res.end(JSON.stringify({
            list: infoList,
            err: 0
        }));
    });
};
