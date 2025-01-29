import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceSelection.css";

const ServiceSelection = ({ setServiceType }) => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    setServiceType(service);
    navigate("/emoji");
  };

  const handleAdminLoginClick = () => {
    navigate("/admin-login");
  };

  return (
    <div className="service-selection">
      {/* Header */}
      <header className="service-header">
        <img
          src="/icons/nppf-logo.webp"
          alt="NPPF Logo"
          className="service-logo"
        />
        <h1 className="service-title">
          Welcome to NPPF Service Feedback System
        </h1>
        <button
          className="admin-login-button"
          onClick={handleAdminLoginClick}
          aria-label="Admin Login"
        >
          Admin Login
        </button>
      </header>

      {/* Services Section */}
      <p className="service-description">Select a Service</p>
      <div className="service-icons">
        {[
          { id: "pension", label: "Pension", img: "pension-pf.png" },
          { id: "loan", label: "Loan", img: "loan.png" },
          { id: "pensioners", label: "Pensioners", img: "pensioners.png" },
          { id: "investment", label: "Investment", img: "investment-portfolio.png" },
        ].map((service) => (
          <div
            key={service.id}
            className="service-icon"
            onClick={() => handleServiceClick(service.id)}
            role="button"
            aria-label={`Select ${service.label} service`}
          >
            <img src={`/icons/${service.img}`} alt={service.label} />
            <span>{service.label}</span>
          </div>
        ))}
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
