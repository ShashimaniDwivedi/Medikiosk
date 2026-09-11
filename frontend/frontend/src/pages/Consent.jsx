function Consent() {
  return (
    <div className="consent-page">

      <div className="consent-card">

        <div className="logo">🔒</div>

        <h1>Your Privacy Matters</h1>

        <p>
          MediKiosk collects your health information to help
          the doctor understand your medical history.
        </p>

        <div className="consent-box">
          <h3>Before you continue</h3>

          <ul>
            <li>Your information will be used for your healthcare.</li>
            <li>Your answers will be shared with the doctor.</li>
            <li>You can ask for help at any time.</li>
          </ul>
        </div>

        <label className="checkbox-row">
          <input type="checkbox" />
          I understand and agree to continue.
        </label>

        <button className="continue-btn">
          Continue →
        </button>

      </div>

    </div>
  );
}

export default Consent;