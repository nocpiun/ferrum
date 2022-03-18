const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var filePath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(filePath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }
    
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment;filename="+ path.basename(filePath));

    var stream = fs.createReadStream(filePath);
    stream.on("data", (data) => {
        res.write(data, "binary");
    });
    stream.on("end", () => {
        res.end();
    });
};
