const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const feedbackController = require("../controllers/feedbackController");
const multer = require("multer");
const path = require("path");
const cloudinary = require('cloudinary').v2;

// Set up multer for temporary file storage (local storage before uploading to Cloudinary)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save in 'uploads' folder temporarily
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
  },
});

const upload = multer({ storage: storage });

// Admin routes
router.post(
  "/register",
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      if (req.file) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.profilePicture = result.secure_url; // Store the Cloudinary URL in the request body
      }
      next(); // Proceed to the adminController.register method
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ message: "Error uploading profile picture" });
    }
  },
  adminController.register
);

router.post("/login", adminController.login);
router.get("/profile/:email", adminController.getProfile);

router.put(
  "/update-admin-profile",
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      if (req.file) {
        // Upload the new profile picture to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.profilePicture = result.secure_url; // Store Cloudinary URL in request body
      }
      next(); // Proceed to the update admin profile handler
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ message: "Error uploading profile picture" });
    }
  },
  adminController.updateAdminProfile
);

router.get("/feedback-counts", feedbackController.getFeedbackCounts);
router.post("/check-old-password", adminController.checkOldPassword);

module.exports = router;
