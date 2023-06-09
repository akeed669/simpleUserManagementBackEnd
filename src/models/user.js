const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
  telephone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  designation: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 25,
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

//use Joi to validate data when registering a new user

function validateUserReg(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    username: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(5).max(5),
    dob: Joi.date().less(new Date().toLocaleDateString()).required(),
    telephone: Joi.string().min(10).max(10).required(),
    designation: Joi.string().min(10).max(25).required(),
  });

  return schema.validate(req);
}

//use Joi to validate data when user sends login request

function validateUserLogin(req) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required().email().label("Username"),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

//use bcrypt to hash new password before storing
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

//use bcrypt to check plain password against hashed password
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
  validateUserReg,
  validateUserLogin,
  hashPassword,
  validatePassword,
};
