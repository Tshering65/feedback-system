const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const feedbackController = require("../controllers/feedbackController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinaryConfig"); // Import Cloudinary configuration

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique filename
  },
});

const upload = multer({ storage: storage });

// Admin routes
router.post("/register", upload.single("profilePicture"), adminController.register);
router.post("/login", adminController.login);
router.get("/profile/:email", adminController.getProfile);
router.put("/update-admin-profile", upload.single("profilePicture"), adminController.updateAdminProfile);
router.get("/feedback-counts", feedbackController.getFeedbackCounts);
router.post("/check-old-password", adminController.checkOldPassword);

module.exports = router;
