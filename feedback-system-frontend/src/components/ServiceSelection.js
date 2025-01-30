import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceSelection.css";

const ServiceSelection = ({ setServiceType }) => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    setServiceType(service); // Update the selected service type
    navigate("/emoji"); // Navigate to the next page
  };

  const handleAdminLoginClick = () => {
    navigate("/admin-login"); // Navigate to Admin Login page
  };

  return (
    <div className="service-selection">
      {/* Header */}
      <header className="service-header">
        <img
          src="/icons/nppf logo.webp" // Correct path for Create React App
          alt="NPPF Logo"
          className="service-logo"
        />
        <h1 className="service-title">
          Welcome to NPPF Service Feedback System
        </h1>

        {/* Admin Login Button */}
        <button className="admin-login-button" onClick={handleAdminLoginClick}>
          Admin Login
        </button>
      </header>

      {/* Services Section */}
      <p className="service-description">Select a Service</p>
      <div className="service-icons">
        <div
          className="service-icon"
          onClick={() => handleServiceClick("pension")}
          role="button"
        >
          <img src="/icons/pension and PF.png" alt="Pension" />
          <span>Pension</span>
        </div>
        <div
          className="service-icon"
          onClick={() => handleServiceClick("loan")}
          role="button"
        >
          <img src="/icons/LOan.png" alt="Loan" />
          <span>Loan</span>
        </div>
        <div
          className="service-icon"
          onClick={() => handleServiceClick("pensioners")}
          role="button"
        >
          <img src="/icons/Pensioners.png" alt="Pensioners" />
          <span>Pensioners</span>
        </div>
        <div
          className="service-icon"
          onClick={() => handleServiceClick("investment")}
          role="button"
        >
          <img src="/icons/investment porfoli.png" alt="Investment" />
          <span>Investment</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="service-footer">
        <p>Get In Touch</p>
        <p>
          1039 (Toll Free) | WhatsApp (17170884) |{" "}
          <a href="mailto:lungten.norbu@nppf.org.bt">
            lungten.norbu@nppf.org.bt
          </a>
        </p>
        <div className="service-locations">
          <div>Thimphu</div>
          <div>Phuentsholing</div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceSelection;
