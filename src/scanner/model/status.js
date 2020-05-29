module.exports = function(host, port) {
    return {
        open: false,
        closed: false,
        timeout: false,
        service: "",
        port,
        host
    }
}