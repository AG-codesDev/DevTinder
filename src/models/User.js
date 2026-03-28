const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minlength: [2, "Min 2 characters"],
      maxlength: [50, "Max 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [5, "Min 5 characters needed"],
      maxlength: [12, "Max 12 characters needed"],
    },
    age: {
      type: Number,
      min: [18, "Min age required is 18"],
      max: [60, "Age above 60 is not valid"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bio: {
      type: String,
      default: "This is a default user bio",
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKT-zEVF-E4SEkm3us25N1DoHQLnC4XWumjw&s",
    },
    skills: {
      type: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("user", userSchema);
