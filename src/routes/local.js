const router = require("express").Router;
const {utils} = require("@rochismo/net-utils");

router.get("/gateway", async (req, res) => {
    const interface = await utils.getInterface();
    res.status(200).json(interface)
})

module.exports = router;