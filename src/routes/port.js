const router = require("express").Router();
const scanner = require("./../scanner");

async function scan(req, res) {
    const host = req.body.host;
    const ports = req.body.ports.split(/\.\s\-gi/) || null;
    const showClosed = req.body.showClosed;
    const results = await scanner.portListScan(host, ports);
    if (showClosed) {
        res.status(200).json(results);
    } else {
        res.status(200).json(results.filter(({open}) => !!open));
    }
}

router.post("/", scan);

module.exports = router;
