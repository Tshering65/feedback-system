// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // Set this in your .env file

module.exports = { cloudinary, uploadPreset };
