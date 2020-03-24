const router = require("express").Router();
const {pinger, utils} = require('@rochismo/net-utils');

async function pingSweep(req, res) {
    const details = await utils.getDetails();
    const ip = details.cidr.split(",")[0];
    const aliveHosts = await pinger.pingSweep(ip);
    res.status(200).json(aliveHosts)
}

async function pingHost(req, res) {
    const ip = req.body.ip;
    if (utils.isValidIp(ip)) {
        const isLiving = pinger.ping(ip);
        res.status(200).json({
            "isLiving": isLiving,
            "message": "valid IP"
        })
    } else res.status(200).json({
        "isLiving": false,
        "message": "Insert valid IP"
    })
}

router.get("/pingSweep", pingSweep(req, res));

router.post("/pingHost", pingHost(req, res));

module.exports = router;