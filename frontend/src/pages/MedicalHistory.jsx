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

  // =====================================================
  // HANDLE TEXT FIELD CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE PDF / IMAGE UPLOAD
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // No file selected
    if (!file) {
      setFormData((previous) => ({
        ...previous,
        reports: "",
        reportFile: null,
      }));

      return;
    }

    // =================================================
    // ALLOWED FILE TYPES
    // =================================================

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF, JPG, JPEG, or PNG file only.");

      e.target.value = "";

      return;
    }

    // =================================================
    // MAXIMUM FILE SIZE = 10 MB
    // =================================================

    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10 MB.");

      e.target.value = "";

      return;
    }

    // =================================================
    // SAVE FILE
    // =================================================

    setFormData((previous) => ({
      ...previous,
      reports: file.name,
      reportFile: file,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setPatientData(formData);

    navigate("/review");
  };

  return (
    <div className="history-page">
      <div className="history-card">
        {/* LOGO */}

        <div className="logo">📋</div>

        <h1>Medical History</h1>

        <p>Tell us about your previous medical history.</p>

        <form onSubmit={handleSubmit}>
          {/* =================================================
              PREVIOUS ILLNESSES
          ================================================= */}

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

          {/* =================================================
              CURRENT MEDICINES
          ================================================= */}

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

          {/* =================================================
              ALLERGIES
          ================================================= */}

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

          {/* =================================================
              PREVIOUS SURGERIES
          ================================================= */}

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

          {/* =================================================
              FAMILY HISTORY
          ================================================= */}

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

          {/* =================================================
              MEDICAL REPORT
          ================================================= */}

          <div className="form-group">
            <label>Upload Medical Report</label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
            />

            <small>
              Supported formats: PDF, JPG, JPEG, PNG
              <br />
              Maximum size: 10 MB
            </small>

            {/* =================================================
                SELECTED FILE
            ================================================= */}

            {formData.reportFile && (
              <div className="selected-report">
                <p>
                  {formData.reportFile.type === "application/pdf"
                    ? "📄 Selected PDF:"
                    : "🖼️ Selected Photo:"}
                </p>

                <strong>{formData.reportFile.name}</strong>

                <p>
                  Size: {(formData.reportFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              CONTINUE
          ================================================= */}

          <button type="submit" className="continue-btn">
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default MedicalHistory;
