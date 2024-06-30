const fs = require("fs");

module.exports = function(req, res) {
    var filePath = req.body.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(filePath)) {
        res.end(JSON.stringify({err: 404}));
        return;
    }

    fs.writeFileSync(filePath, req.body.content);
    res.end();
};
