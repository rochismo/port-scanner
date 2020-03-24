const router = require("express").Router();
const {pinger, utils} = require('@rochismo/net-utils');

router.get("/", (req, res) => {
    async function pingToSelf() {
        const details = await utils.getDetails();
        let ip = details.ip_cidr;
        ip = ip.split("/");
        ip = ip + "'";
        ip = ip[0];
        return await pinger.ping(ip)
    }
});

router.get("/pingSweep", (req, res) => {
    async function pingSweep() {
        const details = await utils.getDetails();
        let ip = details.cidr;
        ip = ip.split(",");
        ip = ip[0];
        let aliveHosts;
        aliveHosts = await pinger.pingSweep(ip);
        return aliveHosts;
    }
});

module.exports = router;