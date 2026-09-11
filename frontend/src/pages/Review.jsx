// import { useNavigate } from "react-router-dom";

function Review() {
  //   const navigate = useNavigate();

  const patient = {
    name: "Patient Name",
    age: "21",
    gender: "Male",
    phone: "XXXXXXXXXX",

    mainProblem: "Headache",
    duration: "3 days",
    severity: "Moderate",
    otherSymptoms: "Mild fever",

    illnesses: "None",
    medicines: "None",
    allergies: "No known allergies",
    surgeries: "None",
    familyHistory: "No significant history",
  };

  const handleSubmit = () => {
    console.log("Final Patient Data:", patient);

    alert("Information submitted successfully!");

    // Later this will send data to FastAPI
  };

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="logo">📋</div>

        <h1>Review Your Information</h1>

        <p>Please review your information before submitting.</p>

        {/* Patient Details */}

        <div className="review-section">
          <h2>Patient Details</h2>

          <div className="info-row">
            <span>Name</span>
            <strong>{patient.name}</strong>
          </div>

          <div className="info-row">
            <span>Age</span>
            <strong>{patient.age}</strong>
          </div>

          <div className="info-row">
            <span>Gender</span>
            <strong>{patient.gender}</strong>
          </div>

          <div className="info-row">
            <span>Phone</span>
            <strong>{patient.phone}</strong>
          </div>
        </div>

        {/* Symptoms */}

        <div className="review-section">
          <h2>Symptoms</h2>

          <div className="info-row">
            <span>Main Problem</span>
            <strong>{patient.mainProblem}</strong>
          </div>

          <div className="info-row">
            <span>Duration</span>
            <strong>{patient.duration}</strong>
          </div>

          <div className="info-row">
            <span>Severity</span>
            <strong>{patient.severity}</strong>
          </div>

          <div className="info-row">
            <span>Other Symptoms</span>
            <strong>{patient.otherSymptoms}</strong>
          </div>
        </div>

        {/* Medical History */}

        <div className="review-section">
          <h2>Medical History</h2>

          <div className="info-row">
            <span>Previous Illnesses</span>
            <strong>{patient.illnesses}</strong>
          </div>

          <div className="info-row">
            <span>Current Medicines</span>
            <strong>{patient.medicines}</strong>
          </div>

          <div className="info-row">
            <span>Allergies</span>
            <strong>{patient.allergies}</strong>
          </div>

          <div className="info-row">
            <span>Previous Surgeries</span>
            <strong>{patient.surgeries}</strong>
          </div>

          <div className="info-row">
            <span>Family History</span>
            <strong>{patient.familyHistory}</strong>
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
