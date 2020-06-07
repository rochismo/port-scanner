//process.on("uncaughtException", function() {})

const express = require("express");
const cors = require("cors");
const getPort = require("get-port");
const routes = require("./src/routes");
class PortScanner {
    constructor() {
        this.app = express();
        this.port = 8081;
    }

    async init() {
        // It should not happen to have more than one electron client opened but who knows
        const port = await getPort({ port: 8081 });
        this.port = port;
        this.app.use(express.urlencoded({ extended: false, limit: "50mb" }));
        this.app.use(express.json({ limit: "50mb" }));

        this.app.use(cors());
        routes.forEach(({ path, router }) => this.app.use(`/${path}`, router));

        this.app.listen(this.port);
    }
}
module.exports = PortScanner;
(async () => {
    const scanner = new PortScanner();
    await scanner.init();
})();
