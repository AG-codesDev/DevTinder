const adminAuth = (req, res, next) => {
  const token = "abc123";

  const isAdminAuthorized = token === "abc123";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthrized access");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz123";
  const isUserAuthorized = token === "xyz1234";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
