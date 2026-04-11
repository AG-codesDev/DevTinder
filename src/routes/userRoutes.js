const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const { connections } = require("mongoose");

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    //return all the connections(accepted) of the logged in user
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
      status: "accepted",
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "photoURL",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "photoURL",
      ]);

    //returning only other person data not the logged in one's
    const data = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

userRouter.get("/user/pending/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "bio",
      "photoURL",
    ]);
    const data = connections.map((connection) => ({
      requestId: connection._id,
      user: connection.fromUserId,
    }));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = userRouter;
