const router = require("express").Router();

const scanner = require("./../scanner");
const defaultPorts = require("./../scanner/defaultPorts");
const finder = require("./../scanner/services");

const { isValid, isWeb } = require("./../scanner/util");
function isPortOpen({ open }) {
    return open;
}

async function scan(req, res) {
    try {
        const ip = req.body.ip;
        const ports = req.body.ports || defaultPorts;
        const autoDetect = req.body.autoDetect;
        const results = await scanner.portListScan(ip, ports);
        if (results.error) {
            return res.status(204).json({ error: results.error });
        }

        const openPorts = results.filter(isPortOpen);
        if (!autoDetect) {
            return res.status(200).json(openPorts);
        }
        const portsWithServices = await Promise.all(
            openPorts.map((port) => {
                return new Promise(async (resolve) => {
                    port.service = await finder.findService(port);
                    resolve(port);
                });
            })
        );
        res.status(200).json(portsWithServices);
    } catch(e) {
        console.log(e)
        res.status(400)
    }
}

async function checkAvailability(req, res) {
    const { port, host } = req.body;
    const status = await scanner.scan(host, port, true);
    console.log(status)
    if (status.error) {
        return res.status(404).json(null);
    }
    res.status(200).json(status);
}

async function sendPayload(req, res) {
    const { port, host, payload } = req.body;
    const errors = [];
    if (!payload) {
        errors.push({message: "Please provide a payload", shouldClosePort: false});
        return res.status(422).json(errors);
    }
    const results = await scanner.scan(host, port, true, payload);
    if (results.error) {
        errors.push(results.error);
        return res.status(500).json(errors);
    }
    res.status(200).json(results);
}

router.post("/", scan);

router.post("/availability", checkAvailability);

router.post("/payload", sendPayload);
module.exports = router;
