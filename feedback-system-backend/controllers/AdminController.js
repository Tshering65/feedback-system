const Admin = require("../models/Admin"); // Assuming you have an Admin model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinaryConfig"); // Import Cloudinary config

// Admin registration
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the input
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

    // Handle file upload to Cloudinary
    let profilePicture = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Automatically detect the file type (image, video, etc.)
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Cloudinary upload error", error });
          }
          profilePicture = result.secure_url; // Cloudinary URL for the uploaded image
        }
      );
      req.pipe(result); // Pipe the file to Cloudinary's upload stream
    }

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      profilePicture, // Save the Cloudinary URL
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Send success response
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ email: admin.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin profile
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

// Update Admin Profile (with Cloudinary upload)
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

    // Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
    }

    // Handle profile picture update to Cloudinary
    if (req.file) {
      // Delete the old profile picture if it exists
      if (admin.profilePicture) {
        const oldPublicId = admin.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(oldPublicId); // Remove old image from Cloudinary
      }

      // Upload new profile picture to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Cloudinary upload error", error });
          }
          admin.profilePicture = result.secure_url; // Save the new Cloudinary URL
        }
      );
      req.pipe(result); // Pipe the new file to Cloudinary's upload stream
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

// Profile picture update (use this for the file upload only)
exports.uploadProfilePicture = upload.single("profilePicture");
