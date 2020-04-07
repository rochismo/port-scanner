require("dotenv").config();
const port = process.env.PORT || 8000;
function addRoutes({path, router}) {
    app.use(`/${path}`, router);
}

function logAddressOnServerStart() {
    console.log(`http://localhost:${port}`)
}

const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");

const app = express();

// Body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

routes.forEach(addRoutes);

app.listen(port, logAddressOnServerStart);