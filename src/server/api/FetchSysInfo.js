const os = require("os");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCPUInfo() {
    var cpu = os.cpus();
    var total = 0, user = 0, nice = 0, sys = 0, idle = 0, irq = 0;

    for(var i = 0; i < cpu.length; i++) {
        user += cpu[i].times.user;
        nice += cpu[i].times.nice;
        sys += cpu[i].times.sys;
        idle += cpu[i].times.idle;
        irq += cpu[i].times.irq;
        total += cpu[i].times.user + cpu[i].times.nice + cpu[i].times.sys + cpu[i].times.idle;
    }
    total /= cpu.length;

    return {
        total,
        user,
        nice,
        sys,
        idle,
        irq
    };
}

async function getCPUUsed() {
    const waitMS = 1000;
    
    var t1 = getCPUInfo();
    await sleep(waitMS);
    var t2 = getCPUInfo();

    var idle = t2.idle - t1.idle;
    var total = t2.total - t1.total;
    var usage = (1 - idle / total) * 100;

    return usage.toFixed(2) +"%";
}

module.exports = async function(req, res) {
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
        cpuUsage: await getCPUUsed()
    }));
};
