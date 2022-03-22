const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    if(!req.files) return;

    const targetPath = req.query.path.replace(/\\/g, "/"); // Absolute Path

    req.files.forEach((value, index) => {
        var tmpFilePath = path.join(__dirname, "../../../"+ value.path.replace("\\", "/"));
        var targetFilePath = path.join(targetPath, value.originalname);

        var rs = fs.createReadStream(tmpFilePath);
        var ws = fs.createWriteStream(targetFilePath);
        rs.pipe(ws);

        rs.on("close", () => {
            fs.unlinkSync(tmpFilePath);
        });
    });

    res.end();
};
