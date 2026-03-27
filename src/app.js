const express = require("express");
const { connectDB } = require("./config/databse");
const UserModel = require("./models/User");
require("dotenv").config();

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

app.post("/signup", async (req, res) => {
  //creating new instance of user model
  const user = new UserModel(req.body);

  await user.save();
  res.send("User added successfully!");
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
