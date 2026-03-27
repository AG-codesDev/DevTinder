const mongoose = require("mongoose");
const connectDB = async () => {
  // console.log(process.env.MONGO_URL);
  await mongoose.connect(`${process.env.MONGO_URL}`);
};

module.exports = { connectDB };
