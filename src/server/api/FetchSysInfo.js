const os = require("os");

module.exports = function(req, res) {
    res.end(JSON.stringify({
        system: os.version(),
        version: os.release(),
        platform: os.platform(),
        arch: os.arch(),
        userInfo: os.userInfo()
    }));
};
