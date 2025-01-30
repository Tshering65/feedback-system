const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
// Remove the redundant cloudinary import
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Import cloudinary and uploadPreset from your custom config
const { cloudinary, uploadPreset } = require("../cloudinaryConfig");
require("dotenv").config();



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "admin_profiles", // Folder name in Cloudinary
    format: async (req, file) => "png", // Convert all uploads to PNG
    public_id: (req, file) => Date.now() + "-" + file.originalname,
    upload_preset: uploadPreset, // Add the upload preset here
  },
});

const upload = multer({ storage });

// Admin Registration
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile picture
    let profilePicture = null;
    if (req.file) {
      profilePicture = req.file.path; // This will be the Cloudinary URL
      console.log("Profile picture URL:", profilePicture);
    }
    
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      profilePicture, // Store the Cloudinary URL
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: admin.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const email = req.params.email;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile (Password & Profile Picture)
exports.checkOldPassword = async (req, res) => {
  console.log("Checking password"); // Add a log to verify if the route is hit.
  try {
    const { email, oldPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile (Password & Profile Picture)
exports.updateAdminProfile = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    if (newPassword && newPassword.trim() !== "") {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
    }

    // Handle profile picture update
    if (req.file) {
      if (admin.profilePicture) {
        const publicId = admin.profilePicture.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(`admin_profiles/${publicId}`, (err, result) => {
          if (err) console.error("Error deleting old profile picture:", err);
        });
      }
      admin.profilePicture = req.file.path;
    }

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      profilePicture: admin.profilePicture,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Profile picture update middleware
exports.uploadProfilePicture = upload.single("profilePicture");