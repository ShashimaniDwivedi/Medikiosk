// import { usePatient } from "../context/PatientContext";
import { usePatient } from "../context/usePatient";

function Review() {
  const { patient } = usePatient();

  const handleSubmit = () => {
    console.log("Final Patient Data:", patient);

    alert("Information submitted successfully!");

    // Later:
    // Send patient data to FastAPI backend
  };

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="logo">📋</div>

        <h1>Review Your Information</h1>

        <p>Please review your information before submitting.</p>

        {/* Language */}

        <div className="review-section">
          <h2>Language</h2>

          <div className="info-row">
            <span>Selected Language</span>
            <strong>{patient.language || "Not provided"}</strong>
          </div>
        </div>

        {/* Patient Details */}

        <div className="review-section">
          <h2>Patient Details</h2>

          <div className="info-row">
            <span>Name</span>
            <strong>{patient.name || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Age</span>
            <strong>{patient.age || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Gender</span>
            <strong>{patient.gender || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Phone</span>
            <strong>{patient.phone || "Not provided"}</strong>
          </div>
        </div>

        {/* Symptoms */}

        <div className="review-section">
          <h2>Symptoms</h2>

          <div className="info-row">
            <span>Main Problem</span>
            <strong>{patient.mainProblem || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Duration</span>
            <strong>{patient.duration || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Severity</span>
            <strong>{patient.severity || "Not provided"}</strong>
          </div>

          <div className="info-row">
            <span>Other Symptoms</span>
            <strong>{patient.otherSymptoms || "Not provided"}</strong>
          </div>
        </div>

        {/* Medical History */}

        <div className="review-section">
          <h2>Medical History</h2>

          <div className="info-row">
            <span>Previous Illnesses</span>
            <strong>{patient.illnesses || "None"}</strong>
          </div>

          <div className="info-row">
            <span>Current Medicines</span>
            <strong>{patient.medicines || "None"}</strong>
          </div>

          <div className="info-row">
            <span>Allergies</span>
            <strong>{patient.allergies || "None"}</strong>
          </div>

          <div className="info-row">
            <span>Previous Surgeries</span>
            <strong>{patient.surgeries || "None"}</strong>
          </div>

          <div className="info-row">
            <span>Family History</span>
            <strong>{patient.familyHistory || "None"}</strong>
          </div>

          <div className="info-row">
            <span>Medical Report</span>
            <strong>{patient.reports || "No file uploaded"}</strong>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Information ✓
        </button>
      </div>
    </div>
  );
}

export default Review;
