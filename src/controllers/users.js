const Joi = require("joi");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

require("dotenv").config();

//use bcrypt to hash new password before storing
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

//use bcrypt to check plain password against hashed password
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

//create a new user
exports.signup = async (req, res, next) => {
  try {
    //validate inputs
    const { error } = validateUserReg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if username already exists
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send("User already registered.");

    const { name, username, password, telephone, designation, role } = req.body;

    //convert request body date to jaavscript date
    const dob = new Date(req.body.dob);

    //hash password for storage and create user object
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      telephone,
      designation,
      role: role || "basic",
      dob,
    });

    //generate jwt token; set it as user's token and save user
    const accessToken = newUser.generateAuthToken();
    newUser.accessToken = accessToken;
    await newUser.save();

    //send jwt token in response header
    res
      .header("x-auth-token", accessToken)
      .header("access-control-expose-headers", "x-auth-token")
      .send(
        _.pick(newUser, ["_id", "name", "username", "role", "accessToken"])
      );
  } catch (error) {
    next(error);
  }
};

// allow login if permissible
exports.login = async (req, res, next) => {
  try {
    //validate inputs
    const { error } = validateUserLogin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { username, password } = req.body;
    //check if username exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Username does not exist");

    //validate password
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(400).send("Password is not correct");

    //generate jwt token
    const accessToken = user.generateAuthToken();

    //update jwt token for user each time
    await User.findByIdAndUpdate(user._id, { accessToken });

    //send token to store in browser local storage
    res.send({ token: accessToken, message: "success!" });
  } catch (error) {
    next(error);
  }
};

//send all users from mongodb collection as a json response object
exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

//get user details from mongodb collection and send response as json object
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//update the telephone number of a user
exports.updateUser = async (req, res, next) => {
  try {
    //destructure request body
    const { telephone } = req.body;
    const update = { telephone };

    const userId = req.params.userId;

    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

//delete a user from collection and send a response
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).send("This user was removed successfully!");
  } catch (error) {
    next(error);
  }
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
