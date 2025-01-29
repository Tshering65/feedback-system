import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import ReactSwitch from "react-switch";
import { FaUserCircle } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [adminProfile, setAdminProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [servicesFeedback, setServicesFeedback] = useState({
    loan: 0,
    pension: 0,
    pensioners: 0,
    investment: 0,
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchProfile();
    fetchServiceFeedback();
  }, []);

  // Fetch the admin profile
  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://nppf-feedback-system.vercel.app' : 'http://localhost:5000';
      const response = await axiosInstance.get(`${apiUrl}/admin/profile/${email}`);
      setAdminProfile({
        ...response.data,
        profilePicture: `${apiUrl}${response.data.profilePicture}`,
      });
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  // Fetch feedback counts for different services
  const fetchServiceFeedback = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://nppf-feedback-system.vercel.app' : 'http://localhost:5000';
      const response = await axiosInstance.get(`${apiUrl}/admin/feedback-counts`);
      setServicesFeedback(response.data);
    } catch (error) {
      toast.error("Error fetching feedback counts");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/admin-login");
  };

  // Verify the old password
  const verifyOldPassword = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/admin/check-old-password",
        { email, oldPassword }
      );
      if (response.status === 200) {
        setIsPasswordCorrect(true);
        toast.success("Old password verified!");
      }
    } catch (error) {
      toast.error("Incorrect old password");
      setIsPasswordCorrect(false);
    }
  };

  // Update admin profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oldPassword", oldPassword);
    if (newProfilePicture) formData.append("profilePicture", newProfilePicture);
    if (newPassword.trim() !== "") formData.append("newPassword", newPassword);

    try {
      const response = await axiosInstance.put(
        "/admin/update-admin-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Profile updated successfully!");
      setAdminProfile((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      setIsUpdating(false);
      setShowProfile(false);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Chart data for feedback count
  const barChartData = {
    labels: ["Loan", "Pension", "Pensioners", "Investment"],
    datasets: [
      {
        label: "Feedback Count",
        data: [
          servicesFeedback.loan,
          servicesFeedback.pension,
          servicesFeedback.pensioners,
          servicesFeedback.investment,
        ],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  // Toggle analytics display
  const handleToggleChange = () => setShowAnalytics(!showAnalytics);

  return (
    <div className="dashboardContainer">
      <div className="headerBar">
        <img
          src="/icons/nppf logo.webp"
          alt="NPPF Logo"
          className="service-logo"
        />
        <div className="profileSection">
          <button
            className="profileButton"
            onClick={() => setShowProfile(!showProfile)}
          >
            {adminProfile.profilePicture ? (
              <img
                src={adminProfile.profilePicture}
                alt="Profile"
                className="profileImage"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
          </button>
          {showProfile && !isUpdating && (
            <div className="profileDropdown">
              <p>
                <strong>Email:</strong> {adminProfile.email}
              </p>
              <button
                onClick={() => {
                  setIsUpdating(true);
                  setShowProfile(false);
                }}
                className="updateButton"
              >
                Update
              </button>
              <button onClick={handleLogout} className="logoutButton">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="sidebar">
        <ul>
          <li>
            <a href="/dashboard" className="serviceLink">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/loan" className="serviceLink">
              Loan
            </a>
          </li>
          <li>
            <a href="/pension" className="serviceLink">
              Pension
            </a>
          </li>
          <li>
            <a href="/pensioners" className="serviceLink">
              Pensioners
            </a>
          </li>
          <li>
            <a href="/investment" className="serviceLink">
              Investment
            </a>
          </li>
        </ul>
      </div>
      <div className="mainContent">
        <h2>Total Feedback For Each Service</h2>
        <div className="toggleSwitch">
          <span>Show Graphical Analytics: </span>
          <ReactSwitch
            checked={showAnalytics}
            onChange={handleToggleChange}
            offColor="#ccc"
            onColor="#86d3ff"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>

        {showAnalytics ? (
          <div className="graphicalAnalytics">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
        ) : (
          <div className="serviceBoxes">
            <div className="serviceBox">
              <img
                src="/icons/lOan.png"
                alt="Loan"
                className="serviceImage"
              />
              <h3>Loan</h3>
              <p>Feedback Count: {servicesFeedback.loan}</p>
            </div>
            <div className="serviceBox">
              <img
                src="/icons/pension and PF.png"
                alt="Pension"
                className="serviceImage"
              />
              <h3>Pension</h3>
              <p>Feedback Count: {servicesFeedback.pension}</p>
            </div>
            <div className="serviceBox">
              <img
                src="/icons/Pensioners.png"
                alt="Pensioners"
                className="serviceImage"
              />
              <h3>Pensioners</h3>
              <p>Feedback Count: {servicesFeedback.pensioners}</p>
            </div>
            <div className="serviceBox">
              <img
                src="/icons/investment porfoli.png"
                alt="Investment"
                className="serviceImage"
              />
              <h3>Investment</h3>
              <p>Feedback Count: {servicesFeedback.investment}</p>
            </div>
          </div>
        )}
        {isUpdating && (
          <div className="modal-overlay">
            <div className="updateForm">
              <h3>Update Profile</h3>
              <form onSubmit={handleProfileUpdate}>
                <label>Old Password (Required):</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  onBlur={verifyOldPassword}
                  required
                />
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isPasswordCorrect}
                />
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={!isPasswordCorrect}
                />
                <label>Change Profile Picture (Optional):</label>
                <input
                  type="file"
                  onChange={(e) => setNewProfilePicture(e.target.files[0])}
                  disabled={!isPasswordCorrect}
                />
                <div className="buttons">
                  <button type="submit" disabled={!isPasswordCorrect}>
                    Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUpdating(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
