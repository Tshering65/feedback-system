import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminRegister.css";

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setAdminData({ ...adminData, profilePicture: e.target.files[0] });
    } else {
      setAdminData({ ...adminData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.email || !adminData.password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true); // Set loading to true when form is submitted

    const formData = new FormData();
    formData.append("email", adminData.email);
    formData.append("password", adminData.password);

    if (adminData.profilePicture) {
      formData.append("profilePicture", adminData.profilePicture);
    }

    try {
      const response = await axiosInstance.post("/admin/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Admin registered successfully"); // Success toast
      setTimeout(() => navigate("/admin-login"), 1500); // Delay navigation to the login page

      // Clear form data after successful registration
      setAdminData({
        email: "",
        password: "",
        profilePicture: null,
      });
    } catch (error) {
      console.error("Registration failed", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      ); // Error toast with server message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="admin-register">
      <ToastContainer /> {/* Ensure this is inside the component */}
      {/* Header */}
      <header className="admin-header">
        <img
          src="/icons/nppf-logo.webp"
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
            value={adminData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminData.password}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
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
