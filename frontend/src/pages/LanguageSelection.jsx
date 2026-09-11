import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { usePatient } from "../context/PatientContext";
import { usePatient } from "../context/usePatient";

function LanguageSelection() {
  const navigate = useNavigate();

  const { patient, updatePatient } = usePatient();

  const [selectedLanguage, setSelectedLanguage] = useState(
    patient.language || "",
  );

  const languages = ["English", "हिंदी", "বাংলা", "मराठी", "தமிழ்", "తెలుగు"];

  const handleContinue = () => {
    if (!selectedLanguage) {
      alert("Please select a language");
      return;
    }

    updatePatient("language", selectedLanguage);

    navigate("/consent");
  };

  return (
    <div className="language-page">
      <div className="language-card">
        <div className="logo">🌐</div>

        <h1>Select Your Language</h1>

        <p>Choose your preferred language to continue</p>

        <div className="language-list">
          {languages.map((language) => (
            <button
              key={language}
              className={
                selectedLanguage === language
                  ? "language-btn selected"
                  : "language-btn"
              }
              onClick={() => setSelectedLanguage(language)}
            >
              {language}
            </button>
          ))}
        </div>

        <button className="continue-btn" onClick={handleContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}

export default LanguageSelection;
