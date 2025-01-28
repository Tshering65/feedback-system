import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin = () => {} }) => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://nppf-feedback-system.vercel.app/api/admin-login", {
        email: adminData.email,
        password: adminData.password,
      },{
        withCredentials: true ,
      });
      console.log("Login Response:", response.data); // Debugging

      toast.success("Login Successful!");
      setTimeout(() => navigate("/dashboard"), 1500); // Delay navigation

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", adminData.email);

      onLogin(response.data.firstLogin);
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      toast.error(
        "Login Failed: " + (error.response?.data?.message || "Server Error")
      );
    }
  };

  return (
    <div className="admin-login">
      <ToastContainer /> {/* Ensure this is inside the component */}
      <header className="admin-header">
        <img
          src="/icons/nppf logo.webp"
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
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
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
