const fs = require("fs");
const path = require("path");
const md5 = require("md5-node");

module.exports = function(req, res) {
    var filePath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(filePath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }
    
    res.setHeader("Content-Type", "application/octet-stream");
    
    // In order to avoid `Invalid character in header content ["Content-Disposition"]`
    try {
        res.setHeader("Content-Disposition", "attachment;filename="+ path.basename(filePath));
    } catch (e) {
        res.setHeader("Content-Disposition", "attachment;filename="+ md5(path.basename(filePath)) + path.extname(filePath));
    }

    var stream = fs.createReadStream(filePath);
    stream.on("data", (data) => {
        res.write(data, "binary");
    });
    stream.on("end", () => {
        res.end();
    });
};
