const router = require("express").Router();
const {pinger, utils} = require('@rochismo/net-utils');

async function pingSweep(req, res) {
    const details = await utils.getDetails();
    const ip = details.cidr.split(",")[0];
    const aliveHosts = await pinger.pingSweep(ip);
    res.status(200).json(aliveHosts);
}

router.get("/pingSweep", pingSweep);

module.exports = router;