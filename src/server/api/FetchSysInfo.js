const os = require("os");
const cpuStat = require("cpu-stat");
const disk = require("diskinfo");

async function getCPUUsage() {
    return new Promise((resolve, reject) => {
        cpuStat.usagePercent((err, percent, seconds) => {
            if(err) reject(err);
            resolve(percent);
        });
    });
}

async function getDiskInfo() {
    return new Promise((resolve, reject) => {
        disk.getDrives((err, drives) => {
            if(err) reject(err);

            for(let i = 0; i < drives.length; i++) {
                var current = drives[i];
                for(let j = 0; j < drives.length; j++) {
                    if(drives[j].mounted === current.mounted && j !== i) {
                        drives.splice(j, 1);
                        j--;
                    }
                }
            }

            resolve(drives);
        });
    });
}

module.exports = async function(req, res) {
    const cpuUsage = await getCPUUsage();
    const diskInfo = await getDiskInfo();

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
        cpuUsage,
        upTime: os.uptime(),
        diskInfo
    }));
};
