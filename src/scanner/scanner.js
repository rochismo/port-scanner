const data = { instance: null };
const SocketManager = require("./socketManager.js");
const {Pinger} = require("@rochismo/net-utils");

module.exports = class PortScanner {
    constructor(sse) {
		this.defaultPorts = [21, 23, 80, 443, 3306, 8080];
		this.pinger = new Pinger(sse);
		this.manager = new SocketManager();
		this.sse = sse;
	}

	async scan(host, port) {
		return new Promise((resolve) => {
			const pingData = await this.pinger.ping(host);
			const {alive} = pingData;
			if (!alive) {
				return resolve({error: "Host not alive"})
			}
			try {
				this.manager.openConnection(host, port);
				const response = await this.manager.waitForResponse();
				resolve(response);
			} catch(error) {
				resolve({error: "Port closed"})
			}
		});
	}

    static createInstance() {
        if (!data.instance) {
            data.instance = new PortScanner();
        }
        return data.instance;
    }
};
