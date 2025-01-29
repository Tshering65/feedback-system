const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "admin-profile-pictures", // Folder in Cloudinary to store the images
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional image transformation
  },
});

const upload = multer({ storage: storage });

// ✅ Admin Registration
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file upload (Cloudinary URL)
    let profilePicture = null;
    if (req.file) {
      profilePicture = req.file.path; // Cloudinary returns the URL in req.file.path
    }

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      profilePicture,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, admin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Check Old Password
exports.checkOldPassword = async (req, res) => {
  try {
    const { email, oldPassword } = req.body;

    if (!email || !oldPassword) {
      return res.status(400).json({ message: "Email and old password are required" });
    }

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

// ✅ Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword) {
      return res.status(400).json({ message: "Email and old password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check old password before updating
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
    }

    // Handle profile picture update (Cloudinary URL)
    if (req.file) {
      // Delete old picture from Cloudinary if it exists
      if (admin.profilePicture) {
        const publicId = admin.profilePicture.split('/').pop().split('.')[0];
        cloudinary.uploader.destroy(publicId, (err, result) => {
          if (err) console.error("Error deleting old profile picture from Cloudinary:", err);
        });
      }
      admin.profilePicture = req.file.path; // Cloudinary URL
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

// ✅ Upload Profile Picture
exports.uploadProfilePicture = upload.single("profilePicture");
