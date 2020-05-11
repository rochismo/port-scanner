const router = require("express").Router();
const { pinger, utils } = require("@rochismo/net-utils");

const invalidIpData = {
    isLiving: false,
    message: "Insert valid IP"
};

async function pingSweep(req, res) {
    const details = await utils.getDetails();
    const ip = details.cidr.split(",")[0];
    const aliveHosts = await pinger.pingSweep(ip);
    res.status(200).json(aliveHosts);
}

async function pingHost(req, res) {
    const ip = req.body.ip;
    if (!utils.isValidIp(ip)) {
        return res.status(400).json(invalidIpData);
    }
    const isLiving = await pinger.ping(ip);
    res.status(200).json({
        isLiving: isLiving,
        message: "valid IP"
    });
}

function validateIp(req, res) {
    const data = utils.isValidIp(req.params.ip) ? {status: 200} : {status: 400};
    res.status(data.status).json(null);
}

function setToken(req, res) {
    const token = req.params.token;
    pinger.setToken(token);
    res.status(200).json(null);
}

router.post("/token/:token", setToken);

router.get("/sweep", pingSweep);

router.get("/validate/:ip", validateIp);

router.post("/host", pingHost);

module.exports = router;
