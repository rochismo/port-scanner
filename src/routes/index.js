const fs = require("fs");
const path = require("path");

const routesPath = path.join(process.cwd(), "routes");
console.log(routesPath)
const data = fs.readdirSync(routesPath);

const routes = data.reduce((routes, route) => {
    if (route === "index.js") return routes;
    const router = require(path.join(routesPath, route));
    routes.push({
        path: route.split(".")[0],
        router
    })
    return routes;
}, []);

module.exports = routes;