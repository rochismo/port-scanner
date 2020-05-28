module.exports = function(port) {
    return {
        open: false,
        closed: false,
        timeout: false,
        service: "",
        port
    }
}