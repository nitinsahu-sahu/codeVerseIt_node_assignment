
const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.MONGO_URI

exports.connectToDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("✅ Local Database connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  }
};