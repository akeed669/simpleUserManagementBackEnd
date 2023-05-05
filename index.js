const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

const userRoutes = require("./src/routes/users");

//use the express framework
const app = express();

//use cors for cross origin resource sharing
app.use(cors());

app.use(express.json());

//to handle POST requests in express ; extracts the body of the POST request to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//routes for receiving requests from front end
app.use("/", userRoutes);

//define mongodb connection via the mongoose client
mongoose
  .connect("mongodb://localhost:27017/mydb", {})
  .then(() => console.log("Connected to the User database successfully"))
  .catch((error) => console.error("Could not connect", error));

//set the port for listening
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
