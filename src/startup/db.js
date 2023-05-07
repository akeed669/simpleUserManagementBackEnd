const mongoose = require("mongoose");
const winston = require("winston");

//define mongodb connection via the mongoose client
module.exports = function () {
  mongoose
    .connect("mongodb://mongo:27017/mydb", {})
    .then(() => winston.info("Connected to the User database successfully"));

  // .catch((error) => console.error("Could not connect", error));
  // we need to log this error and terminate the process instead of logging in the console
};
