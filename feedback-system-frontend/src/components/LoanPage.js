import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AdminDashboard.css";

const LoanPage = () => {
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
   const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
   const [newProfilePicture, setNewProfilePicture] = useState(null);
   const email = localStorage.getItem("email");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackCounts = async () => {
      try {
        const response = await axios.get(`/feedback/loan/emoji-counts`);
        setEmojiFeedbackCounts(response.data);
      } catch (error) {
        console.error("Error fetching loan feedback counts:", error);
      }
    };

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

    fetchFeedbackCounts();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/admin-login");
  };

  const verifyOldPassword = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/check-old-password", { email, oldPassword });
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
      const response = await axios.put("/admin/update-admin-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message);
      setAdminProfile((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      setIsUpdating(false);
      setShowProfile(false); // Hide dropdown when update form is submitted
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };


  const fetchFeedbackDetails = async (emojiType) => {
    try {
      const response = await axios.get(
        `/feedback/loan/feedback-details/${emojiType}`
      );
      setFeedbackDetails(response.data);
      setSelectedEmoji(emojiType);
    } catch (error) {
      console.error("Error fetching feedback details:", error);
    }
  };



  const exportData = async (service, format) => {
    try {
      const response = await axios.get(
        `/feedback/${service}/export-${format}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${service}_feedback.${format === "csv" ? "csv" : "xlsx"}`
      );
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
              <p><strong>Email:</strong> {adminProfile.email}</p>
              <button onClick={() => { setIsUpdating(true); setShowProfile(false); }} className="updateButton">Update</button>
              <button onClick={handleLogout} className="logoutButton">Logout</button>
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
        <h2>Feedback Count For Loan Service</h2>
        <div className="serviceBoxes">
          {Object.keys(emojiMap).map((emojiType) => (
            <div
              key={emojiType}
              className={`serviceBox ${
                selectedEmoji === emojiType ? "selected" : ""
              }`}
              onClick={() => fetchFeedbackDetails(emojiType)}
              style={{ cursor: "pointer" }}
            >
              <div className="emoji">{emojiMap[emojiType]}</div>
              <h3>{emojiType.charAt(0).toUpperCase() + emojiType.slice(1)}</h3>
              <p>Feedback Count: {emojiFeedbackCounts[emojiType]}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => exportData("loan", "csv")}
          style={{
            backgroundColor: "#088395",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "15px",
            cursor: "pointer",
            margintop: "20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#071952")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#088395")}
        >
          Export CSV
        </button>

        <button
          onClick={() => exportData("loan", "excel")}
          style={{
            backgroundColor: "#088395",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "15px",
            cursor: "pointer",
            margin: "20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#071952")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#088395")}
        >
          Export Excel
        </button>

        {/* Feedback Table */}
        {selectedEmoji && (
          <div className="feedbackTableContainer">
            <h3>
              Feedback Details for{" "}
              {selectedEmoji.charAt(0).toUpperCase() + selectedEmoji.slice(1)}
            </h3>
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
                  <tr>
                    <td colSpan="4" className="noFeedback">
                      No feedback available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={!isPasswordCorrect} />
      
                <label>Profile Picture:</label>
                <input type="file" accept="image/*" onChange={(e) => setNewProfilePicture(e.target.files[0])} disabled={!isPasswordCorrect} />
      
                <button type="submit" disabled={!isPasswordCorrect} className="submitButton">
                  Update
                </button>
              </form>
              <button className="closeButton" onClick={() => setIsUpdating(false)}>X</button>
            </div>
          </div>
        )}
      </div>
            <ToastContainer /> {/* Toastify container */}
      
    </div>
  );
};

export default LoanPage;
