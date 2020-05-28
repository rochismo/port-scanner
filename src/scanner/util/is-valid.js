const privateIp = require("private-ip"),
    ipRegex = require("ip-regex");

module.exports = function (ip, port) {
    if (!port) return { valid: false, message: "Please enter a valid port" };
    try {
        const [validIp] = ipRegex(ip).exec(ip);
        if (!privateIp(validIp)) {
            return { valid: false, message: "That's not an ip of your network. You must not go outside your network."}
        }

        return {ip: validIp, port};
    } catch(e) {
        return { valid: false, message: "Please enter a valid ip"}
    }
};
