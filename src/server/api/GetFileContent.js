const fs = require("fs");
const langDetector = require("language-detect");

module.exports = function(req, res) {
    var filePath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(filePath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    var format = langDetector.filename(filePath);
    // format ??= "";
    if(!format) format = "";

    res.end(JSON.stringify({
        format: format.toLowerCase(),
        content: fs.readFileSync(filePath, {encoding: "utf-8"})
    }));
};
