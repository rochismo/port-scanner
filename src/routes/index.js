const fs = require("fs");
const path = require("path");

const routesPath = __dirname;
const data = fs.readdirSync(routesPath);

function generateRouters(routes, route) {
    if (route === "index.js") return routes;
    const router = require(path.join(routesPath, route));
    routes.push({
        path: route.split(".")[0],
        router
    })
    return routes;
}

const routes = data.reduce(generateRouters, []);

module.exports = routes;