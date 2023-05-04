const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./src/models/userModel");
const userRoutes = require("./src/routes/userRoutes.js");

//use the express framework
const app = express();

//set the port for listening
const PORT = process.env.PORT || 3001;

//to handle POST requests in express ; extracts the body of the POST request to req.body
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
