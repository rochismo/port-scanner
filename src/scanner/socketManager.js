const { Socket } = require("net");
const randomBytes = require("random-bytes");

module.exports = class SocketManager {
    constructor() {}

    async createConnection(host, port) {
        const bytes = await randomBytes(20);
        return new Promise(resolve => {
            const socket = new Socket();
            socket.connect(port, host);
            socket.on("connect", () => {
                socket.write(bytes);
            });
            socket.on("close", hadError => {
                resolve({ open: hadError ? false : true });
                socket.destroy();
            }); 
        });
    }
};
