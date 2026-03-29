require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/databse");
const UserModel = require("./models/User");
const { validateSignupRequest } = require("./utils/Validations");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await UserModel.findOne({ email: userEmail });
    // const user = await UserModel.find({ email: userEmail });

    if (user === null) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Something Went wrong at our end!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    res.send(await UserModel.find({}));
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfull!!");
    } else {
      throw new Error("Invalid Credentials");
    }
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

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.send("user deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
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
