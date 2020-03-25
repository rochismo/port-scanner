const data = { instance: null };
const SocketManager = require("./socketManager.js");
const {pinger} = require("@rochismo/net-utils");

module.exports = class PortScanner {
    constructor(sse) {
		this.manager = new SocketManager();
		this.sse = sse;
	}

	scan(host, port) {
		return new Promise(async (resolve) => {
			try {
				const response = await this.manager.createConnection(host, port);
				resolve(response);
			} catch(error) {
				resolve({error: "Port closed"})
			}
		});
	}

	async portListScan(host, ports) {
		const pingData = await pinger.ping(host);
		const {alive} = pingData;
		if (!alive) {
			return {error: "Host not alive"};
		}
		const scanPromises = ports.map(port => this.scan(host, port));
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
