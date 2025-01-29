import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceSelection from "./components/ServiceSelection";
import EmojiSelection from "./components/EmojiSelection";
import FeedbackForm from "./components/FeedbackForm";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import LoanPage from "./components/LoanPage";
import PensionPage from "./components/PensionPage";
import PensionersPage from "./components/PensionersPage";
import InvestmentPage from "./components/InvestmentPage";


const App = () => {
  const [serviceType, setServiceType] = useState(""); 
  const [emojiFeedback, setEmojiFeedback] = useState(""); 



  return (
    <Router>
      <Routes>
        <Route path="/" element={<ServiceSelection setServiceType={setServiceType}/>} />
        <Route path="/emoji" element={<EmojiSelection setEmojiFeedback={setEmojiFeedback}/>} />
        <Route path="/feedback" element={<FeedbackForm service_type={serviceType} emoji_feedback={emojiFeedback} />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-login" element={<AdminLogin onLogin={setResetRequired} />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/loan" element={<LoanPage />} />
        <Route path="/pension" element={<PensionPage />} />
        <Route path="/pensioners" element={<PensionersPage />} />
        <Route path="/investment" element={<InvestmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
