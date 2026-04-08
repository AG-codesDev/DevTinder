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
      const { userId: toUserId, status } = req.params;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "User ID not valid" });
      }

      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ message: "Cannot send request to yourself" });
      }

      const isUserPresent = await User.findById(toUserId);
      if (!isUserPresent) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already exists" });
      }

      const newConnectionReq = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionReq.save();

      res.status(201).json({ message: "Request sent successfully", data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      //validate status
      const allowedStatus = ["rejected", "accepted"];
      const isStatusAllowed = allowedStatus.includes(status);

      if (!isStatusAllowed) {
        return res.status(400).json({ message: "Status is not allowed!" });
      }
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "User ID not valid" });
      }

      //verify status is interested for accepting
      // verify loggedInuser is toUserId
      // verify requestId is valid

      const modifyRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!modifyRequest) {
        return res.status(400).json({ message: "Request doesn't exist!" });
      }
      modifyRequest.status = status;
      await modifyRequest.save();

      return res
        .status(200)
        .json({ message: "Request Updated successfully", data: modifyRequest });
    } catch (err) {
      res.json(err.message);
    }
  },
);

module.exports = requestRouter;
