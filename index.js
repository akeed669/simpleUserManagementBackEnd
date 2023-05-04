const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//use the express framework
const app = express();

//set the port for listening to WHAT?
const PORT = process.env.PORT || 3001;

//to handle POST requests in express
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//define mongodb connection via the mongoose client
mongoose
  .connect("mongodb://localhost:27017/mydb", {})
  .then(() => {
    mongoose.set("useFindAndModify", false);
    console.log("Connected to the User database successfully");
  })
  .catch((error) => console.error("Could not connect", error));
