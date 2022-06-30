const fs = require("fs");
const path = require("path");

const starsPath = path.join(__dirname, "../stars.json");

module.exports = function(req, res) {
    var newStarDir = req.body.path;
    var list = new Map(JSON.parse(fs.readFileSync(starsPath)));
    list.set(list.size, newStarDir);

    fs.writeFileSync(starsPath, JSON.stringify(Array.from(list)));
    res.end();
};
