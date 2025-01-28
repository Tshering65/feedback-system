import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { FaUserCircle } from "react-icons/fa";
import ReactSwitch from "react-switch";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [adminProfile, setAdminProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const email = localStorage.getItem("email");

  const [servicesFeedback, setServicesFeedback] = useState({
    loan: 0,
    pension: 0,
    pensioners: 0,
    investment: 0,
  });

  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.get(`/admin/profile/${email}`);
        const profilePictureUrl = response.data.profilePicture
          ? `http://localhost:5000${response.data.profilePicture}`
          : null;
        setAdminProfile({
          ...response.data,
          profilePicture: profilePictureUrl,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchServiceFeedback = async () => {
      try {
        const response = await axios.get("/admin/feedback-counts");
        setServicesFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback counts:", error);
      }
    };

    fetchProfile();
    fetchServiceFeedback();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/admin-login");
  };

  const verifyOldPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/check-old-password",
        { email, oldPassword }
      );
      if (response.status === 200) {
        setIsPasswordCorrect(true);
        toast.success("Old password verified!");
      }
    } catch (error) {
      setIsPasswordCorrect(false);
      toast.error("Incorrect old password");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oldPassword", oldPassword);

    if (newProfilePicture) formData.append("profilePicture", newProfilePicture);
    if (newPassword.trim() !== "") formData.append("newPassword", newPassword);

    try {
      const response = await axios.put(
        "/admin/update-admin-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message);
      setAdminProfile((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      setIsUpdating(false);
      setShowProfile(false); // Hide dropdown when update form is submitted
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleToggleChange = (checked) => {
    setShowAnalytics(checked);
  };

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
              <img src="/icons/lOan.png" alt="Loan" className="serviceImage" />
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

                <label>Profile Picture:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProfilePicture(e.target.files[0])}
                  disabled={!isPasswordCorrect}
                />

                <button
                  type="submit"
                  disabled={!isPasswordCorrect}
                  className="submitButton"
                >
                  Update
                </button>
              </form>
              <button
                className="closeButton"
                onClick={() => setIsUpdating(false)}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer /> {/* Toastify container */}
    </div>
  );
};

export default AdminDashboard;
