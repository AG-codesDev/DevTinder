const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateUpdateProfileRequest,
  validatePasswordUpdate,
} = require("../utils/Validations");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const existingUser = req.user;
    validateUpdateProfileRequest(req);

    Object.keys(req.body).forEach((key) => {
      existingUser[key] = req.body[key];
    });

    await existingUser.save();

    res.status(200).json({ message: "Profile updated", data: existingUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/password/edit", userAuth, async (req, res) => {
  try {
    validatePasswordUpdate(req);
    const existingUser = req.user;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({ message: "Password updated", data: existingUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
