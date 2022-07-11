const os = require("os");
const cpuStat = require("cpu-stat");

module.exports = function(req, res) {
    cpuStat.usagePercent((err, percent, seconds) => {
        if(err) throw err;
    
        res.end(JSON.stringify({
            system: os.version(),
            version: os.release(),
            platform: os.platform(),
            arch: os.arch(),
            userInfo: os.userInfo(),
            memory: {
                total: os.totalmem(),
                free: os.freemem()
            },
            cpuUsage: percent,
            upTime: os.uptime()
        }));
    });
};
