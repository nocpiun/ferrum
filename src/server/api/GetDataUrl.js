const fs = require("fs");
const path = require("path");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
module.exports = function(req, res) {
    var filePath = req.query.path.replace(/\\/g, "/"); // Absolute Path
    if(!fs.existsSync(filePath)) {
        res.end(JSON.stringify({url: "", err: 404}));
        return;
    }

    var urlHead = "data:image/"+ path.extname(filePath).replace(".", "") +";base64,";
    var pictureData = fs.readFileSync(filePath).toString("base64");
    res.end(JSON.stringify({
        bdata: urlHead + pictureData,
        err: 0
    }));
};
