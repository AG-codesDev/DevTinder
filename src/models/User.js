const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minlength: [2, "Min 2 characters"],
      maxlength: [50, "Max 50 characters"],
      validate: {
        validator(value) {
          return validator.matches(value, /^[a-zA-Z\s'-]+$/);
        },
        message:
          "First name may only contain letters, spaces, hyphens, and apostrophes",
      },
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Max 50 characters"],
      validate: {
        validator(value) {
          if (value == null || value === "") return true;
          return validator.matches(value, /^[a-zA-Z\s'-]+$/);
        },
        message:
          "Last name may only contain letters, spaces, hyphens, and apostrophes",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [5, "Min 5 characters needed"],
      validate: {
        validator(value) {
          return validator.isStrongPassword(value); // simply return true or false
        },
        message:
          "Password must be at least 8 chars with uppercase, lowercase, number, and symbol",
      },
    },
    age: {
      type: Number,
      min: [18, "Min age required is 18"],
      max: [60, "Age above 60 is not valid"],
      validate: {
        validator(value) {
          if (value == null) return true;
          return validator.isInt(String(value), { min: 18, max: 60 });
        },
        message: "Age must be a whole number between 18 and 60",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bio: {
      type: String,
      default: "This is a default user bio",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKT-zEVF-E4SEkm3us25N1DoHQLnC4XWumjw&s",
      validate: {
        validator(value) {
          return validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: "Photo URL must be a valid http(s) URL",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator(skills) {
          if (!Array.isArray(skills)) return false;
          if (skills.length > 10) return false;
          return skills.every(
            (s) =>
              typeof s === "string" &&
              validator.isLength(s.trim(), { min: 1, max: 50 }),
          );
        },
        message:
          "Skills must be an array of up to 10 non-empty strings (max 50 characters each)",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign(
    {
      userId: user._id,
    },
    "devTinder@dev",
    { expiresIn: "7d" },
  );
  return token;
};

userSchema.methods.isPasswordValid = async function (UserInputPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    UserInputPassword,
    user.password,
  );
  return isPasswordValid;
};

module.exports = mongoose.model("user", userSchema);
