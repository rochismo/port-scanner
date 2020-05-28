const { Socket } = require("net");
const randomBytes = require("random-bytes");

const { isWeb } = require("./util");
const generate = require("./model/status");

const ports = require("./ports.json");

const TIMEOUT = "ETIMEDOUT";
const REFUSED = "ECONNREFUSED";

process.on("uncaughtException", function(error) {
    /** This is meant to make the app not crash when an error of type ECONNREFUSED is thrown */   
})


function findDefaultPort(port) {
    const foundPort = ports[port];
    const service = foundPort.find(portService => portService.tcp || portService.status === "Official")
    if (!service) {
        return "Unknown service"
    }
    return `${service.description} [${service.status}]`
}


module.exports = class SocketManager {
    constructor() {}

<<<<<<< HEAD
    async createConnection(host, port) {
        const payload = ``

        if (!httpAttempt.error) {
            return httpAttempt
        }
        return new Promise(async resolve => {
            const socket = new Socket();
            const status = generate(port);
            
=======
    async createConnection(host, port, payload = null) {
        const bytes = payload || await randomBytes(20);
        return new Promise(resolve => {
            const socket = new Socket();
            const status = {
                open: false,
                closed: false,
                timeout: false,
                service: "",
                response: "",
                port
            }
>>>>>>> be34c2bdffbf9082328a50141ed0c67a1b74036e
            socket.setTimeout(10000);
            socket.connect(port, host);
            socket.on("connect", () => {
                socket.write(bytes);
                status.service = findDefaultPort(port)
                status.open = true;
            });

            // In case we get data first
            socket.on("data", (data) => {
                status.open = true;
<<<<<<< HEAD
                status.service = data.toString() || findDefaultPort(port)
=======
                status.response = data.toString();
>>>>>>> be34c2bdffbf9082328a50141ed0c67a1b74036e
                socket.destroy();
            });

            socket.on("close", hadError => {
                if (!status.service) {
                    status.service = findDefaultPort(port);
                }

                status.service = status.service.substr(0, 255);
                resolve(status);
            });
            

            socket.on("error", (error) => {
                if (error.code === TIMEOUT) {
                    status.timeout = true;
                    status.info = "Probably filtered";
                }

                if (error.code === REFUSED) {
                    status.closed = true;
                    // In case it was set to open before
                    status.open = false;
                }
                socket.destroy();
            });

            socket.on("timeout", () => {
                status.timeout = true;
                status.open = false;
                socket.destroy()
            })
        });
    }
};
