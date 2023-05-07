const winston = require("winston");
// require("winston-mongodb");

module.exports = function () {
  process.on("uncaughtException", (exception) => {
    winston.error(exception.message, exception);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://db:27017/mydb",
  //     level: "error",
  //   })
  // );
};
