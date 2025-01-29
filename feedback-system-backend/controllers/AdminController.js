const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
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

    // Handle file upload
    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
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

// ✅ Admin Login (Fixed Issues)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" }); // Return 401 for security
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

// ✅ Get Admin Profile (Fixed URL Parameter)
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

// ✅ Check Old Password (Secure Verification)
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

// ✅ Update Admin Profile (Password & Picture)
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

    // Handle profile picture update
    if (req.file) {
      // Delete old picture if it exists
      if (admin.profilePicture) {
        const oldPicturePath = path.join(__dirname, "..", "uploads", path.basename(admin.profilePicture));
        fs.unlink(oldPicturePath, (err) => {
          if (err) console.error("Error deleting old profile picture:", err);
        });
      }
      admin.profilePicture = `/uploads/${req.file.filename}`;
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
