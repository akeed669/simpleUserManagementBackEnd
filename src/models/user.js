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
  telephone:{
    type: String,
    required: true,
    minlength:10,
    maxlength:10
  },
  designation:{
    type: String,
    required: true,
    minlength:10,
    maxlength:25
  },
  role: {
    required: true,
    type: String,
    default: "basic",
    enum: ["basic", "admin"],
  },
  accessToken: {
    type: String,
  },
});

//method to generate jwt required when logging in as user
//signed with username, role, name and id ; expires in 24 hours
//encrypted with secret from .env file

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      username: this.username,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
