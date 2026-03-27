require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/databse");
const UserModel = require("./models/User");

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

app.put("/user", async (req, res) => {
  try {
    const emailId = req.body.emaiId;
    const updatedUser = await UserModel.findOneAndUpdate(emailId, req.body, {
      new: true,
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
    res.status(500).send("Something went wrong");
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
