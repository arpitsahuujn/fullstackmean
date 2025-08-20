// database connection code

const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();   // loads .env variables into process.env

mongoose.connect(process.env.MONGODB_LOCATION).then(() => {
  console.log("✅ MongoDB connected to Atlas");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});