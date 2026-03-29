const validator = require("validator");
const validateSignupRequest = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }
  if (
    typeof firstName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("All fields must be strings");
  }
  if (firstName.length < 2) {
    throw new Error("First and last name must be at least 2 characters long");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }
};

module.exports = { validateSignupRequest };
