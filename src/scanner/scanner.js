const data = { instance: null };
const SocketManager = require("./socketManager.js");
const {pinger} = require("@rochismo/net-utils");

module.exports = class PortScanner {
    constructor(sse) {
		this.defaultPorts = [21, 23, 80, 443, 3306, 8080];
		this.manager = new SocketManager();
		this.sse = sse;
	}

	scan(host, port) {
		return new Promise(async (resolve) => {
			
			try {
				const response = await this.manager.openConnection(host, port);
				resolve(response);
			} catch(error) {
				resolve({error: "Port closed"})
			}
		});
	}

	async portListScan(host, ports = this.defaultPorts) {
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