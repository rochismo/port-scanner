require("dotenv").config();

const express = require("express");
const routes = require("./src/routes");

const app = express();

const port = process.env.PORT || 8000;

// Body parser middleware
app.use(express.urlencoded({extended: false}));

routes.forEach(({path, router}) => app.use(path, router));

app.listen(port);