const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const { connections } = require("mongoose");
const User = require("../models/User");

const safeUserData = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "bio",
  "photoURL",
];
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    //return all the connections(accepted) of the logged in user
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
      status: "accepted",
    })
      .populate("fromUserId", safeUserData)
      .populate("toUserId", safeUserData);

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
    }).populate("fromUserId", safeUserData);
    const data = connections.map((connection) => ({
      requestId: connection._id,
      user: connection.fromUserId,
    }));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);

  // return all the users except
  //0. the looged in user
  //1. the users who are already in connection (accepted)
  //2. the users who has sent the connection request to logged in user or ingonred the logged in user
  //3. the users to whom logged in user has sent the connection request or ignored their profile
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });
    console.log(hideUsersFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender bio photoURL")
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = userRouter;
