const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth.js");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getUser", (req, res) => {
  try {
    throw new Error("New error");
    res.send("Getting user data from database");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("User deleted from database");
});

app.get("/user/addProfile", userAuth, (req, res) => {
  res.send("User profile added");
});

app.get("/user/login", (req, res) => {
  res.send("User login successful");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server error. Please Wait...");
  }
});

app.listen(7777, () => {
  console.log("Server is running successfully on port 7777");
});
