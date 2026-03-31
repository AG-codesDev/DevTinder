require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/databse");
const UserModel = require("./models/User");
const { validateSignupRequest } = require("./utils/Validations");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { user } = req;

    res.send(user.firstName + " sent you connection request");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/signup", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "age",
      "photoURL",
      "bio",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field),
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid fields in requests");
    }

    const userId = req.params.userId;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      message: "user Updated!",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

connectDB()
  .then((result) => {
    console.log("Database connection estabslished successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server is running successfully on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:" + err);
  });
