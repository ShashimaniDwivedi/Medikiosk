import { useState } from "react";

function MedicalHistory() {
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
  };

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="logo">📋</div>

        <h1>Medical History</h1>

        <p>Tell us about your previous medical history.</p>

        <form onSubmit={handleSubmit}>
          {/* Previous Illness */}
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

          {/* Current Medicines */}
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

          {/* Allergies */}
          <div className="form-group">
            <label>Allergies</label>

            <textarea
              name="allergies"
              placeholder="Example: Penicillin, food allergies..."
              value={formData.allergies}
              onChange={handleChange}
              rows="2"
            />
          </div>

          {/* Previous Surgeries */}
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

          {/* Family History */}
          <div className="form-group">
            <label>Family Medical History</label>

            <textarea
              name="familyHistory"
              placeholder="Example: Diabetes or heart disease in family..."
              value={formData.familyHistory}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Upload Reports */}
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
