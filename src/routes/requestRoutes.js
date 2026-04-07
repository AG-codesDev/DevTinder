const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //req validations
      const allowedStatus = ["interested", "ignored"];
      const isStatusAllowed = allowedStatus.includes(status);

      if (!isStatusAllowed) {
        return res.status(400).send("Status not allowed");
      }

      const isUserIdValid = mongoose.Types.ObjectId.isValid(toUserId);
      if (!isUserIdValid) {
        return res.status(400).send("User Id not valid");
      }
      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("Request cannot be sent to same user!");
      }
      const existingRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Request already exist");
      }
      const isUserPresent = await User.findOne({ _id: toUserId });
      if (!isUserPresent) {
        return res.status(400).send("User not present. Invalid Request!!");
      }

      const newConnectionReq = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await newConnectionReq.save();

      res.send(
        `${req.user.firstName} ${status} in ${isUserPresent.firstName} profile`,
      );
    } catch (err) {
      res.send(err.message);
    }
  },
);

module.exports = requestRouter;
