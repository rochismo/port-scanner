const http = require("http"),
    https = require("https"),
    url = require("url");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const protocols = {
    http,
    https,
};

// It works but at what cost?
function determineProtocol(port) {
    return port.toString().endsWith("43") ? "https" : "http";
}

module.exports = function (host, port) {
    // Build the url
    const protocol = determineProtocol(port);
    const _url = `${protocol}://${host}:${port}/unexistent-resource-by-port-scanner`;
    const parsed = url.parse(_url);
    parsed.timeout = 10000;

    // Perform the request
    const request = protocols[protocol].get(parsed);
    return new Promise((resolve) => {
        request.on("error", (_) => resolve({ error: true }));
        request.on("response", (response) => {
            resolve({
                error: false,
                data: {
                    headers: response.headers,
                    isHttps: protocol === "https"
                },
            });
            request.end()
        });
        request.on("timeout", () => {
            resolve({ error: true });
            request.abort();
            request.end();
        });
    });
};
