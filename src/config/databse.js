const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://appgaurav19:UfzhyI9nU9DcmkrJ@namastenodepractise.gzvurzn.mongodb.net/DevTinder",
  );
};

module.exports = { connectDB };
