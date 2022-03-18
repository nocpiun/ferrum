const fs = require("fs");
const path = require("path");

const starsPath = path.join(__dirname, "../stars.json");

module.exports = function(req, res) {
    res.end(fs.readFileSync(starsPath));
};
