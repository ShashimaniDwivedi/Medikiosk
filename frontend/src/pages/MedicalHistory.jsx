import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    reportFile: patient.reportFile || null,
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

    if (!file) {
      setFormData((previous) => ({
        ...previous,
        reports: "",
        reportFile: null,
      }));

      return;
    }

    // Only PDF allowed
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      e.target.value = "";
      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      reports: file.name,
      reportFile: file,
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
          {/* Previous Illnesses */}
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
              placeholder="Example: medicine or food allergies..."
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
              placeholder="Example: diabetes or heart disease in family..."
              value={formData.familyHistory}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Medical Report */}
          <div className="form-group">
            <label>Upload Medical Report</label>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            <small>Supported format: PDF | Maximum size: 10 MB</small>

            {formData.reportFile && (
              <div className="selected-report">
                <p>📄 Selected file:</p>

                <strong>{formData.reportFile.name}</strong>

                <p>
                  Size: {(formData.reportFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Continue */}
          <button type="submit" className="continue-btn">
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default MedicalHistory;
