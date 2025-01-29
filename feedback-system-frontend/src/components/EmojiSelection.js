import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmojiSelection.css";

const EmojiSelection = ({ setEmojiFeedback }) => {
  const navigate = useNavigate();

  // Handles the click event for an emoji
  const handleEmojiClick = (emoji) => {
    setEmojiFeedback(emoji); // Update the emoji feedback state
    navigate("/feedback"); // Navigate to the feedback page
  };

  return (
    <div className="feedback">
      {/* Header Section */}
      <header>
        <img
          src="/icons/nppf-logo.webp" // Ensure the correct file placement
          alt="NPPF Logo"
          className="logo"
        />
        <h1>Welcome to NPPF Service Feedback System</h1>
      </header>

      {/* Emoji Selection Section */}
      <p>What is Your Reaction?</p>
      <div className="emoji-section">
        <div className="emoji-icons">
          {[
            { label: "Happy", icon: "😊", value: "happy" },
            { label: "Satisfactory", icon: "🙂", value: "satisfactory" },
            { label: "Unsatisfactory", icon: "😡", value: "unsatisfactory" },
            { label: "Bad", icon: "😞", value: "bad" },
          ].map(({ label, icon, value }) => (
            <div key={value} className="emoji-icon" onClick={() => handleEmojiClick(value)}>
              <span role="img" aria-label={label} className="emoji">
                {icon}
              </span>
              <span className="emoji-text">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="emoji-footer">
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
    </div>
  );
};

export default EmojiSelection;
