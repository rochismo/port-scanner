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

async function checkAvailability(req, res) {
    const {port, host} = req.body;
    const status = await scanner.scan(host, port);
    if (status.error) {
        return res.status(404).json(null)
    }
    res.status(200).json(status.open)
}

async function sendPayload(req, res) {
    const {port, host, payload} = req.body;
    const errors = [];
    if (!payload) {
        errors.push("Please provide a payload");
        return res.status(422).json(errors);
    }
    const results = await scanner.scan(host, port, payload);
    if (results.error) {
        errors.push(results.error)
        return res.status(500).json(errors)
    }
    res.status(200).json(results);
}

router.post("/", scan);

router.post("/availability", checkAvailability);

router.post("/payload", sendPayload);
module.exports = router;