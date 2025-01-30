const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const feedbackController = require("../controllers/feedbackController");
const multer = require("multer");
const cloudinary = require("../cloudinary"); // Cloudinary config import

// Multer file upload setup for Cloudinary
const storage = multer.memoryStorage(); // Use memoryStorage to keep files in memory

const upload = multer({ storage: storage });

// Admin routes
router.post(
  "/register",
  upload.single("profilePicture"), // Handle file upload
  adminController.register // Call controller to handle registration
);

router.post("/login", adminController.login);
router.get("/profile/:email", adminController.getProfile);

// Update admin profile - now uses Cloudinary for profile picture upload
router.put(
  "/update-admin-profile",
  upload.single("profilePicture"), // Handle file upload
  adminController.updateAdminProfile // Call controller to handle profile update
);

router.get("/feedback-counts", feedbackController.getFeedbackCounts);
router.post("/check-old-password", adminController.checkOldPassword);

module.exports = router;
