const data = { instance: null };
const SocketManager = require("./socketManager.js");
const { pinger } = require("@rochismo/net-utils");

module.exports = class PortScanner {
    constructor(sse) {
        this.manager = new SocketManager();
        this.sse = sse;
    }

    async scan(host, port, isSingle = false, payload = null) {
        return new Promise(async (resolve) => {
            try {
                if (isSingle) {
                    const pingData = await pinger.ping(host);
                    const { alive } = pingData;
                    if (!alive) {
                        resolve({ error: "Host not alive" });
                    }
                }
                const response = await this.manager.createConnection(
                    host,
                    port,
                    payload
                );
                resolve(response);
            } catch (error) {
                resolve({ error: "Port closed" });
            }
        });
    }

    async portListScan(host, ports) {
        const pingData = await pinger.ping(host);
        const { alive } = pingData;
        if (!alive) {
            return { error: "Host not alive" };
        }
        const scanPromises = ports.map((port) => this.scan(host, port));
        const openPorts = await Promise.all(scanPromises);
        return openPorts;
    }

    static createInstance() {
        if (!data.instance) {
            data.instance = new PortScanner();
        }
        return data.instance;
    }
};
