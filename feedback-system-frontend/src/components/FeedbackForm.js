import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import "./FeedbackForm.css";

const UniqueFeedbackForm = ({ service_type, emoji_feedback }) => {
  const [text_feedback, setTextFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Function to count words in text feedback
  const countWords = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word).length;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!emoji_feedback || !service_type) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }

    // Phone number validation (Bhutan format: starts with 17 or 77, 8 digits)
    const phoneRegex = /^(17|77)\d{6}$/;
    if (!phoneRegex.test(phone)) {
      toast.error(
        "Invalid phone number. It must start with 17 or 77 and be 8 digits long."
      );
      return;
    }

    // Validate word count (for bad/unsatisfactory feedback)
    if (text_feedback && countWords(text_feedback) > 250) {
      toast.error("Feedback cannot exceed 250 words.");
      return;
    }

    try {
      await axiosInstance.post("/feedback", {
        service_type,
        emoji_feedback,
        text_feedback,
        email,
        phone,
      });

      toast.success("Feedback submitted successfully!");

      // Delay redirection to allow the user to see success message
      setTimeout(() => {
        navigate("/"); // Redirect to homepage (change if needed)
      }, 2000);

      // Reset form fields
      setTextFeedback("");
      setEmail("");
      setPhone("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting feedback."
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="feedback-form-container">
      {/* Header Section */}
      <header>
        <img src="/icons/nppf-logo.webp" alt="NPPF Logo" className="logo" />
        <h1>Welcome to NPPF Service Feedback System</h1>
      </header>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit}>
        {/* Text Feedback (Required only for bad/unsatisfactory responses) */}
        {(emoji_feedback === "unsatisfactory" || emoji_feedback === "bad") && (
          <div className="form-group">
            <label>Feedback:</label>
            <textarea
              value={text_feedback}
              onChange={(e) => {
                if (countWords(e.target.value) <= 250) {
                  setTextFeedback(e.target.value);
                }
              }}
              maxLength={300}
              required
              className="input-field"
            />
            <p className="word-count">
              {countWords(text_feedback)} / 250 words
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>

        {/* Phone Number Input */}
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="input-field"
            placeholder="Starts with 17 or 77, 8 digits total"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* Footer Section */}
      <footer className="feedback-footer">
        <p>Get In Touch</p>
        <p>
          1039 (Toll Free) | WhatsApp (17170884) |{" "}
          <a href="mailto:lungten.norbu@nppf.org.bt">
            lungten.norbu@nppf.org.bt
          </a>
        </p>
        <div className="locations">
          <div>Thimphu</div>
          <div>Phuentsholing</div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default UniqueFeedbackForm;
