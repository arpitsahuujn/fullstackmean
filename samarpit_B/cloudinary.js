// cloudinary.js
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();   // loads .env variables into process.env

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = cloudinary;
