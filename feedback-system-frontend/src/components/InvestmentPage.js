import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";

const InvestmentPage = () => {
  const [emojiFeedbackCounts, setEmojiFeedbackCounts] = useState({
    happy: 0,
    satisfactory: 0,
    unsatisfactory: 0,
    bad: 0,
  });

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState([]);
  const [adminProfile, setAdminProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackCounts = async () => {
      try {
        const response = await axiosInstance.get(`/feedback/investment/emoji-counts`);
        setEmojiFeedbackCounts(response.data);
      } catch (error) {
        console.error("Error fetching investment feedback counts:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/admin/profile/${email}`);
        const profilePictureUrl = response.data.profilePicture
          ? `http://localhost:5000${response.data.profilePicture}`
          : null;
        setAdminProfile({ ...response.data, profilePicture: profilePictureUrl });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchFeedbackCounts();
    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/admin-login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const verifyResponse = await axiosInstance.post("/admin/check-old-password", {
        email,
        oldPassword,
      });

      if (verifyResponse.status !== 200) {
        toast.error("Incorrect old password");
        return;
      }

      setIsPasswordCorrect(true);
      toast.success("Old password verified!");

      const formData = new FormData();
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      if (newProfilePicture) formData.append("profilePicture", newProfilePicture);
      if (newPassword.trim()) formData.append("newPassword", newPassword);

      const response = await axiosInstance.put("/admin/update-admin-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message);
      setAdminProfile((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));

      setIsUpdating(false);
      setShowProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const fetchFeedbackDetails = async (emojiType) => {
    try {
      const response = await axiosInstance.get(`/feedback/investment/feedback-details/${emojiType}`);
      setFeedbackDetails(response.data);
      setSelectedEmoji(emojiType);
    } catch (error) {
      console.error("Error fetching feedback details:", error);
    }
  };

  const exportData = async (service, format) => {
    try {
      const response = await axiosInstance.get(`/feedback/${service}/export-${format}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${service}_feedback.${format === "csv" ? "csv" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const emojiMap = {
    happy: "😊",
    satisfactory: "😐",
    unsatisfactory: "😡",
    bad: "😞",
  };

  return (
    <div className="dashboardContainer">
      <div className="headerBar">
        <img src="/icons/nppf logo.webp" alt="NPPF Logo" className="service-logo" />
        <div className="profileSection">
          <button className="profileButton" onClick={() => setShowProfile(!showProfile)}>
            {adminProfile.profilePicture ? (
              <img src={adminProfile.profilePicture} alt="Profile" className="profileImage" />
            ) : (
              <FaUserCircle size={40} />
            )}
          </button>
          {showProfile && !isUpdating && (
            <div className="profileDropdown">
              <p><strong>Email:</strong> {adminProfile.email}</p>
              <button onClick={() => setIsUpdating(true)} className="updateButton">Update</button>
              <button onClick={handleLogout} className="logoutButton">Logout</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mainContent">
        <h2>Feedback Count For Investment Service</h2>
        <div className="serviceBoxes">
          {Object.keys(emojiMap).map((emojiType) => (
            <div
              key={emojiType}
              className={`serviceBox ${selectedEmoji === emojiType ? "selected" : ""}`}
              onClick={() => fetchFeedbackDetails(emojiType)}
              style={{ cursor: "pointer" }}
            >
              <div className="emoji">{emojiMap[emojiType]}</div>
              <h3>{emojiType.charAt(0).toUpperCase() + emojiType.slice(1)}</h3>
              <p>Feedback Count: {emojiFeedbackCounts[emojiType]}</p>
            </div>
          ))}
        </div>

        <div className="export-buttons">
          <button onClick={() => exportData("investment", "csv")} className="exportButton">
            Export CSV
          </button>
          <button onClick={() => exportData("investment", "excel")} className="exportButton">
            Export Excel
          </button>
        </div>

        {selectedEmoji && (
          <div className="feedbackTableContainer">
            <h3>Feedback Details for {selectedEmoji.charAt(0).toUpperCase() + selectedEmoji.slice(1)}</h3>
            <table className="feedbackTable">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Feedback</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {feedbackDetails.length > 0 ? (
                  feedbackDetails.map((feedback, index) => (
                    <tr key={index}>
                      <td>{feedback.email}</td>
                      <td>{feedback.phone}</td>
                      <td>{feedback.feedback || "N/A"}</td>
                      <td>{new Date(feedback.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No feedback available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default InvestmentPage;
