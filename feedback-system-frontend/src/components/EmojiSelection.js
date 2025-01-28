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
      {" "}
      {/* Updated class name to match CSS */}
      {/* Header Section */}
      <header>
        <img
          src="/icons/nppf logo.webp" // Correct path for Create React App
          alt="NPPF Logo"
          className="logo"
        />
        <h1>Welcome to NPPF Service Feedback System</h1>
      </header>
      {/* Emoji Selection Section */}
      <p>What is Your Reaction?</p>
      <div className="emoji-section">
        <div className="emoji-icons">
          <div className="emoji-icon" onClick={() => handleEmojiClick("happy")}>
            <span role="img" aria-label="happy" className="emoji">
              😊
            </span>
            <span className="emoji-text">Happy</span>
          </div>
          <div
            className="emoji-icon"
            onClick={() => handleEmojiClick("satisfactory")}
          >
            <span role="img" aria-label="satisfactory" className="emoji">
              🙂
            </span>
            <span className="emoji-text">Satisfactory</span>
          </div>
          <div
            className="emoji-icon"
            onClick={() => handleEmojiClick("unsatisfactory")}
          >
            <span role="img" aria-label="unsatisfactory" className="emoji">
              😡
            </span>
            <span className="emoji-text">Unsatisfactory</span>
          </div>
          <div className="emoji-icon" onClick={() => handleEmojiClick("bad")}>
            <span role="img" aria-label="bad" className="emoji">
              😞
            </span>
            <span className="emoji-text">Bad</span>
          </div>
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
