const express = require("express");
const { connectDB } = require("./config/databse");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new UserModel(req.body);
  // console.log(req.body);

  await user.save();
  res.send("User added successfully!");
});

connectDB()
  .then((result) => {
    console.log("Database connection estabslished successfully");
    app.listen(7777, () => {
      console.log("Server is running successfully on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:" + err);
  });
