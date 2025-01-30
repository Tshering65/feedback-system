import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminRegister.css";

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setAdminData({ ...adminData, profilePicture: e.target.files[0] });
    } else {
      setAdminData({ ...adminData, [e.target.name]: e.target.value });
    }
  };

  console.log(adminData); // Log the adminData state to verify

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!adminData.email || !adminData.password) {
      toast.error("Email and password are required.");
      return;
    }
  
    if (!adminData.email.endsWith("@nppf.org")) {
      toast.error("Please use an official nppf.org email.");
      return;
    }
  
    let imageUrl = "";
  
    // Upload image if it exists
    if (adminData.profilePicture) {
      try {
        const formData = new FormData();
        formData.append("file", adminData.profilePicture);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = cloudinaryResponse.data.secure_url; // Ensure correct Cloudinary URL
      } catch (error) {
        console.error("Cloudinary upload failed", error);
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }
  
    try {
      // Ensure you're passing the image URL here
      const response = await axios.post("/admin/register", {
        email: adminData.email,
        password: adminData.password,
        profilePicture: imageUrl,  // Passing image URL (or null if no image)
      });
      console.log("Registration Response:", response.data.profilePicture);

  
      toast.success("Admin registered successfully");
      setTimeout(() => navigate("/admin-login"), 1500);
  
      setAdminData({ email: "", password: "", profilePicture: null });
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="admin-register">
      <ToastContainer /> {/* Ensure this is inside the component */}
      {/* Header */}
      <header className="admin-header">
        <img
          src="/icons/nppf logo.webp"
          alt="NPPF Logo"
          className="admin-logo"
        />
      </header>
      {/* Registration Form */}
      <div className="register-container">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*"
          />
          <button type="submit">Register</button>
        </form>
      </div>
      {/* Footer */}
      <footer className="admin-footer">
        <p>Get In Touch</p>
        <p>
          1039 (Toll Free) | WhatsApp (17170884) |{" "}
          <a href="mailto:lungten.norbu@nppf.org.bt">
            lungten.norbu@nppf.org.bt
          </a>
        </p>
        <div className="admin-locations">
          <div>Thimphu</div>
          <div>Phuentsholing</div>
        </div>
      </footer>
    </div>
  );
};

export default AdminRegister;
