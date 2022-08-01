const fs = require("fs");
const path = require("path");
const mimeType = require("mime-type/with-db");

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

    const mime = mimeType.lookup(path.extname(filePath).replace(".", ""));

    var urlHead = "data:"+ mime +";base64,";
    var pictureData = fs.readFileSync(filePath).toString("base64");
    res.end(JSON.stringify({
        bdata: urlHead + pictureData,
        err: 0
    }));
};
