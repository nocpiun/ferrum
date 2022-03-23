const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    var picturePath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(picturePath)) {
        res.end(JSON.stringify({url: "", err: 404}));
        return;
    }

    var urlHead = "data:image/"+ path.extname(picturePath).replace(".", "") +";base64,";
    var pictureData = fs.readFileSync(picturePath).toString("base64");
    res.end(JSON.stringify({
        url: urlHead + pictureData,
        err: 0
    }));
};
