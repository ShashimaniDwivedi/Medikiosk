import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Symptoms() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mainProblem: "",
    duration: "",
    severity: "",
    otherSymptoms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Symptoms:", formData);

    navigate("/medical-history");
  };

  return (
    <div className="symptoms-page">
      <div className="symptoms-card">
        <div className="logo">🩺</div>

        <h1>Tell Us About Your Symptoms</h1>

        <p>Please describe what you are experiencing.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>What is your main problem?</label>

            <textarea
              name="mainProblem"
              placeholder="Example: I have a headache..."
              value={formData.mainProblem}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>How long have you had this problem?</label>

            <input
              type="text"
              name="duration"
              placeholder="Example: 3 days"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>How severe is it?</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>

              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div className="form-group">
            <label>Any other symptoms?</label>

            <textarea
              name="otherSymptoms"
              placeholder="Example: fever, cough, weakness..."
              value={formData.otherSymptoms}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Symptoms;
