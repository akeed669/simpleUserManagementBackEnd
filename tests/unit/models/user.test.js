const { User } = require("../../../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      role: "basic",
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    expect(decoded).toMatchObject(payload);
  });
});
