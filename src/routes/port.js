const router = require("express").Router();
const scanner = require("./../scanner");
const defaultPorts = require("./../scanner/defaultPorts");
async function scan(req, res) {
    const ip = req.body.ip;
    const ports = req.body.ports || defaultPorts;

    const showClosed = req.body.showClosed;
    const results = await scanner.portListScan(ip, ports);
    
    if (showClosed) {
        res.status(200).json(results);
    } else {
        res.status(200).json(results.filter(({open}) => !!open));
    }
}

router.post("/", scan);

module.exports = router;
