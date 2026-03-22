const express = require("express");

const app = express();

app.listen(7777, () => {
  console.log("Server is running successfully on port 7777");
});

app.use("/test", (req, res) => {
  res.send("Hello from test");
});

app.use("/home", (req, res) => {
  res.send("Hello from home page");
});
