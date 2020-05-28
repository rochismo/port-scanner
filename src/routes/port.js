const router = require("express").Router();
const scanner = require("./../scanner");
const defaultPorts = require("./../scanner/defaultPorts");
const { isValid, isWeb } = require("./../scanner/util");
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

async function playground(req, res) {
    const { ip, port, isHttp = false } = req.body;
    const data = isValid(ip, port);

    if (data.valid === false) {
        return res.status(422).json({message: data.message})
    }
    const httpData = await isWeb(data.ip, data.port);
    res.status(200).json({data, httpData})
}

router.post("/", scan);

router.post("/playground", playground);

module.exports = router;