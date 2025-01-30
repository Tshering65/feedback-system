import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin = () => {} }) => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Add loading state for button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is being submitted

    try {
      const response = await axiosInstance.post(
        "/admin/login", // Ensure this URL is relative to your backend server
        { email: adminData.email, password: adminData.password },
        { withCredentials: true }  // Ensure cookies/session are properly handled
      );

      console.log("Login Response:", response.data); // Debugging

      toast.success("Login Successful!");
      setTimeout(() => navigate("/dashboard"), 1500); // Delay navigation to allow toast to appear

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", adminData.email);

      onLogin(response.data.firstLogin);
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      toast.error(
        "Login Failed: " + (error.response?.data?.message || "Server Error")
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="admin-login">
      <ToastContainer /> {/* Ensure this is inside the component */}
      <header className="admin-header">
        <img
          src="/icons/nppf-logo.webp"
          alt="NPPF Logo"
          className="admin-logo"
        />
      </header>
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={adminData.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={adminData.password}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
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

export default AdminLogin;
