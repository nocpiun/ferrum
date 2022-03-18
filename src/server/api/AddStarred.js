const fs = require("fs");
const path = require("path");

const starsPath = path.join(__dirname, "../stars.json");

module.exports = function(req, res) {
    var newStarDir = req.body.path;
    var list = JSON.parse(fs.readFileSync(starsPath));
    var newList = list.push(newStarDir);

    fs.writeFileSync(starsPath, JSON.stringify(newList));
};
