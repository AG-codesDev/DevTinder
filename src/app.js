const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth.js");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getUser", (req, res) => {
  res.send("Getting user data from database");
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

app.listen(7777, () => {
  console.log("Server is running successfully on port 7777");
});
