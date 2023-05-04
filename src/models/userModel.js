const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

//create user schema for mongodb collection
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    trim: true, //white spaces will be removed from both sides of the string.
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  dob: {
    type: Date,
    required: true,
  },
  role: {
    required: true,
    type: String,
    default: "basic",
    enum: ["basic", "admin"],
  },
  license: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  accessToken: {
    type: String,
  },
});
