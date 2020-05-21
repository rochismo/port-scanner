const router = require("express").Router();
const { utils } = require("@rochismo/net-utils");

router.get("/gateway", async (req, res) => {
    try {
        const interface = await utils.getInterface();
        res.status(200).json(interface.gateway_ip);
    } catch(e) {
        // Default interface not found, not returning anything
        res.status(204).json("");
    }
});

module.exports = router;
