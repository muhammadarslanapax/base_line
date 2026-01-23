const express = require("express");
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors = require("cors");
const { unless } = require("express-unless");

const { authenticate } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/errorHandler");
app.use(express.static("public"));
const { authenticateRoutes } = require("./config/unlessRoutes");

const requestLogger = require("./middlewares/requestLogger.js");
const routes = require("./routes");

app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,

    credentials: true,
  })
);
app.use(
  express.urlencoded({
    extends: true,
    limit: "16kb",
  })
);
 authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));
app.use(require("./middlewares/paginate").paginate);

app.use(routes);

app.use(requestLogger);
app.use(errorHandler);

 app.use(authenticate);

module.exports = app;
