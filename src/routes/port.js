const router = require("express").Router();
const scanner = require("./../scanner");

router.get("/", async (req, res) => {
    const host = req.body.host;
    const ports = req.body.ports.split(/\.\s\-gi/) || null;
    const results = await scanner.portListScan(host, ports);
    console.log(results);
    res.json(results);
})

module.exports = router;
