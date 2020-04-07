const { Socket } = require("net");
const randomBytes = require("random-bytes");

const TIMEOUT = "ETIMEDOUT";
const REFUSED = "ECONNREFUSED";

process.on("uncaughtException", function(error) {
    /** This is meant to make the app not crash when an error of type ECONNREFUSED is thrown */   
})

module.exports = class SocketManager {
    constructor() {}

    async createConnection(host, port) {
        const bytes = await randomBytes(20);
        return new Promise(resolve => {
            const socket = new Socket();
            const status = {
                open: false,
                closed: false,
                timeout: false,
                info: "",
                port
            }
            socket.setTimeout(10000);
            socket.connect(port, host);
            socket.on("connect", () => {
                socket.write(bytes);
                status.open = true;
            });

            // In case we get data first
            socket.on("data", (data) => {
                status.open = true;

                socket.destroy();
            });

            socket.on("close", hadError => {
                resolve(status);
            });
            

            socket.on("error", (error) => {
                if (error.code === TIMEOUT) {
                    status.timeout = true;
                    status.open = true;
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
                socket.destroy()
            })
        });
    }
};
