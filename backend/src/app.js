"use strict";

require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const server = require('../server')
// const { User } = require("./models/user.model");
// const GroupChat = require("./models/groupchat.model");
// const Message = require("./models/message.model");

// jsdoc swagger
// const swaggerUi = require("swagger-ui-express");
// const expressSwagger = require("express-swagger-generator");

// let options = {
//   swaggerDefinition: {
//     info: {
//       description: "This is a sample server",
//       title: "Swagger",
//       version: "1.0.0",
//     },
//     host: "localhost:3000",
//     basePath: "/v1",
//     produces: ["application/json", "application/xml"],
//     schemes: ["http", "https"],
//   },
//   basedir: __dirname, //app absolute path
//   files: ["./routes/**/*.js"], //Path to the API handle folder
// };

const app = express();
app.use(cors());

// expressSwagger(app)(options);
//
// init middleware
app.use(morgan("dev")); //logger
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const io = new Server(4000, {
  cors: {
    // origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: [],
  },
});

const ioChat = new Server(8080, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: [],
  },
});

// init db
require("./database/init.database");
require("./socket/chat.service")(ioChat);
require("./socket/location.service")(io);
app.get("/", (req, res) => {
  res.send("Hello");
});

// init router
app.use("/api", require("./routes"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(expressSwagger));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
  // error.
});

module.exports = app;
