const express = require("express");

const app = express();

app.listen(7777, () => {
  console.log("Server is running successfully on port 7777");
});

// app.use("/user", (req, res) => {
//   res.send("Hello from USER");
// });

//dynamic routes
app.get("/user/:id/:name", (req, res) => {
  // responding to get request
  console.log(req.query);
  res.send(`THIS IS USER with ${req.params.id} and name ${req.params.name} `);
});

app.post("/user", (req, res) => {
  //saved data to database
  res.send({ firstName: "Apurva", lastName: "Gaurav" });
});

app.delete("/user", (req, res) => {
  //deleted data from database
  res.send("Deleted data from DB successfully");
});
