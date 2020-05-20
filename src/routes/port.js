const router = require("express").Router();
const scanner = require("./../scanner");
const defaultPorts = require("./../scanner/defaultPorts");

function isPortOpen({open}) {
    return open;
}

async function scan(req, res) {
    const ip = req.body.ip;
    const ports = req.body.ports || defaultPorts;

    const results = await scanner.portListScan(ip, ports);

    if (results.error) {
        return res.status(204).json({error: results.error});
    }
    
    
    const openPorts = results.filter(isPortOpen);
    res.status(200).json(openPorts);
}

router.post("/", scan);

module.exports = router;