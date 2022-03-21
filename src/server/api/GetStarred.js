const fs = require("fs");
const path = require("path");

const starsPath = path.join(__dirname, "../stars.json");

module.exports = function(req, res) {
    if(!fs.existsSync(starsPath)) fs.writeFileSync(starsPath, JSON.stringify([]));

    res.end(fs.readFileSync(starsPath));
};
