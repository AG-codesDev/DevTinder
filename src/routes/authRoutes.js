const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/User");
const { validateSignupRequest } = require("../utils/Validations");
const bcrypt = require("bcrypt");

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successfull!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  //creating new instance of user model

  try {
    validateSignupRequest(req);

    const allowedFields = ["firstName", "lastName", "email", "password"];

    const isAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field),
    );
    if (!isAllowed) {
      return res
        .status(400)
        .send(
          "Invalid request fields found - Only FirstName,LastName,Email and Password should be provided",
        );
    }

    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    if (err.code === 1100) {
      return res.status(400).send("Email already exists");
    }
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
