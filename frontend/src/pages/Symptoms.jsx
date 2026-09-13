import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../context/usePatient";

function Symptoms() {
  const { patient, updatePatient } = usePatient();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleNext = () => {
    setError("");

    // Main problem is required
    if (!patient.mainProblem.trim()) {
      setError("Please enter your main problem.");
      return;
    }

    // Duration is required
    if (!patient.duration.trim()) {
      setError("Please enter how long you have had this problem.");
      return;
    }

    // Severity is required
    if (!patient.severity) {
      setError("Please select the severity.");
      return;
    }

    // Go to AI Interview
    navigate("/ai-interview");
  };

  return (
    <div className="symptoms-page">
      <div className="symptoms-card">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon">🩺</div>

          <div>
            <h1>Tell Us About Your Symptoms</h1>

            <p>Please provide information about your current health problem.</p>
          </div>
        </div>

        {/* Main Problem */}
        <div className="form-group">
          <label htmlFor="mainProblem">What is your main problem?</label>

          <textarea
            id="mainProblem"
            value={patient.mainProblem}
            onChange={(e) => updatePatient("mainProblem", e.target.value)}
            placeholder="For example: headache, stomach pain, fever..."
            rows={4}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="duration">How long have you had this problem?</label>

          <input
            id="duration"
            type="text"
            value={patient.duration}
            onChange={(e) => updatePatient("duration", e.target.value)}
            placeholder="For example: 2 days, 1 week, 3 months..."
          />
        </div>

        {/* Severity */}
        <div className="form-group">
          <label>How severe is the problem?</label>

          <div className="severity-options">
            <label className="severity-option">
              <input
                type="radio"
                name="severity"
                value="Mild"
                checked={patient.severity === "Mild"}
                onChange={(e) => updatePatient("severity", e.target.value)}
              />

              <span>Mild</span>
            </label>

            <label className="severity-option">
              <input
                type="radio"
                name="severity"
                value="Moderate"
                checked={patient.severity === "Moderate"}
                onChange={(e) => updatePatient("severity", e.target.value)}
              />

              <span>Moderate</span>
            </label>

            <label className="severity-option">
              <input
                type="radio"
                name="severity"
                value="Severe"
                checked={patient.severity === "Severe"}
                onChange={(e) => updatePatient("severity", e.target.value)}
              />

              <span>Severe</span>
            </label>
          </div>
        </div>

        {/* Other Symptoms */}
        <div className="form-group">
          <label htmlFor="otherSymptoms">
            Are you experiencing any other symptoms?
          </label>

          <textarea
            id="otherSymptoms"
            value={patient.otherSymptoms}
            onChange={(e) => updatePatient("otherSymptoms", e.target.value)}
            placeholder="For example: nausea, weakness, cough..."
            rows={4}
          />
        </div>

        {/* Error */}
        {error && <div className="form-error">⚠️ {error}</div>}

        {/* Navigation */}
        <div className="button-container">
          <button
            className="back-btn"
            onClick={() => navigate("/patient-details")}
          >
            ← Back
          </button>

          <button className="next-btn" onClick={handleNext}>
            Continue to AI Interview →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Symptoms;
