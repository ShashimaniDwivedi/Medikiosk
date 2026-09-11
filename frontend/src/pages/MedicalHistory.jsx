import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { usePatient } from "../context/PatientContext";
import { usePatient } from "../context/usePatient";

function MedicalHistory() {
  const navigate = useNavigate();

  const { patient, setPatientData } = usePatient();

  const [formData, setFormData] = useState({
    illnesses: patient.illnesses || "",
    medicines: patient.medicines || "",
    allergies: patient.allergies || "",
    surgeries: patient.surgeries || "",
    familyHistory: patient.familyHistory || "",
    reports: patient.reports || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFormData((previous) => ({
      ...previous,
      reports: file ? file.name : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPatientData(formData);

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

            {formData.reports && <p>Selected file: {formData.reports}</p>}
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
