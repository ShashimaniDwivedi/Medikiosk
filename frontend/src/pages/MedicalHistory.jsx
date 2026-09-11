import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MedicalHistory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    illnesses: "",
    medicines: "",
    allergies: "",
    surgeries: "",
    familyHistory: "",
    reports: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      reports: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Medical History:", formData);

    navigate("/review");
  };

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="logo">📋</div>

        <h1>Medical History</h1>

        <p>Tell us about your previous medical history.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Previous Illnesses</label>

            <textarea
              name="illnesses"
              placeholder="Example: Diabetes, asthma, blood pressure..."
              value={formData.illnesses}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Current Medicines</label>

            <textarea
              name="medicines"
              placeholder="Enter medicines you currently take..."
              value={formData.medicines}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Allergies</label>

            <textarea
              name="allergies"
              placeholder="Example: medicine or food allergies..."
              value={formData.allergies}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Previous Surgeries</label>

            <textarea
              name="surgeries"
              placeholder="Mention any previous surgeries..."
              value={formData.surgeries}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Family Medical History</label>

            <textarea
              name="familyHistory"
              placeholder="Example: diabetes or heart disease in family..."
              value={formData.familyHistory}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Upload Prescription / Medical Report</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />

            <small>Supported formats: JPG, PNG, PDF</small>
          </div>

          <button type="submit" className="continue-btn">
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default MedicalHistory;
