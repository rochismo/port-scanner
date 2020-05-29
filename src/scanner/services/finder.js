const ports = require("./ports.json");
const { isWeb } = require("./../util");
module.exports = class Finder {
    constructor() {}

    async findService(data) {
        console.log(data);
        const response = await isWeb(data.host, data.port);
        console.log(response)
        if (response.error) return this._findDefaultPort(data.port);
        const {headers} = response.data;
        const isHttps = response.data.isHttps
        const server = headers.server || headers['x-powered-by'];
        return !server ? `${isHttps ? `Https` : `Http`} Server` : `${server} Server` 
    }

    _findDefaultPort(port) {
        const foundPort = ports[port];
        const service = foundPort.find(
            (portService) =>
                portService.tcp || portService.status === "Official"
        );
        if (!service) {
            return "Unknown service";
        }
        return `${service.description} [${service.status}]`;
    }
};
