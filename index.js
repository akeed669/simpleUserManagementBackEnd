const winston = require("winston");
const express = require("express");
const cors = require("cors");
const users = require("./src/controllers/users");
const error = require("./src/middleware/error");
const app = express();

require("./src/startup/logging")();
require("./src/startup/db")();

//use cors for cross origin resource sharing
app.use(cors());

//to parse JSON data into req.body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routes for receiving requests from front end
app.use("/", users);

// error middleware
app.use(error);

//set the port for listening
const port = process.env.PORT || 3001;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
