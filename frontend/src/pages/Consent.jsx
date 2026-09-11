import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Consent() {
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const handleContinue = () => {
    if (!agreed) {
      alert("Please agree before continuing");
      return;
    }

    navigate("/patient-details");
  };

  return (
    <div className="consent-page">
      <div className="consent-card">
        <div className="logo">🔒</div>

        <h1>Your Privacy Matters</h1>

        <p>
          MediKiosk collects your health information to help the doctor
          understand your medical history.
        </p>

        <div className="consent-box">
          <h3>Before you continue</h3>

          <ul>
            <li>Your information will be used for healthcare purposes.</li>
            <li>Your answers will be available to the doctor.</li>
            <li>You can ask for help whenever required.</li>
          </ul>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I understand and agree to continue.
        </label>

        <button className="continue-btn" onClick={handleContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}

export default Consent;
