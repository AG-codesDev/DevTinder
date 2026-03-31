const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized Access");
    }
    const decodeObj = jwt.verify(token, "devTinder@dev");
    const { userId } = decodeObj;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("UNAUTHORIZED: " + err.message);
  }
};

module.exports = { userAuth };
