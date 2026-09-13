import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PATIENT
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadPatient() {
      try {
        const response = await fetch("http://127.0.0.1:8000/patients");

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        const patients = Array.isArray(data)
          ? data
          : Array.isArray(data.patients)
            ? data.patients
            : [];

        const selectedPatient = patients.find(
          (item, index) => String(item.id || item._id || index) === String(id),
        );

        if (!selectedPatient) {
          throw new Error("Patient record not found");
        }

        if (!cancelled) {
          setPatient(selectedPatient);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Patient profile error:", err);

          setError(err.message || "Unable to load patient details.");

          setLoading(false);
        }
      }
    }

    loadPatient();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =====================================================
  // CLOUDINARY REPORT
  // `reports` IS DIRECT CLOUDINARY URL STRING
  // =====================================================

  const reportUrl = typeof patient?.reports === "string" ? patient.reports : "";

  // =====================================================
  // AI INTERVIEW
  // =====================================================

  const getAIInterview = () => {
    if (Array.isArray(patient?.ai_interview)) {
      return patient.ai_interview;
    }

    if (Array.isArray(patient?.aiInterview)) {
      return patient.aiInterview;
    }

    if (typeof patient?.ai_interview === "string") {
      try {
        return JSON.parse(patient.ai_interview);
      } catch {
        return [];
      }
    }

    return [];
  };

  const aiInterview = getAIInterview();

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state">
          <div className="profile-spinner"></div>

          <p>Loading patient profile...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !patient) {
    return (
      <div className="profile-page">
        <div className="profile-state profile-error">
          <div className="profile-error-icon">!</div>

          <h2>Patient Not Found</h2>

          <p>{error || "Unable to load patient record."}</p>

          <button
            className="profile-back-btn"
            onClick={() => navigate("/doctor-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROFILE
  // =====================================================

  return (
    <div className="profile-page">
      {/* =================================================
          HEADER
          ================================================= */}

      <header className="profile-header">
        <div className="profile-header-left">
          <button
            className="profile-back"
            onClick={() => navigate("/doctor-dashboard")}
          >
            ←
          </button>

          <div>
            <h1>Patient Profile</h1>

            <p>MediKiosk Medical Record</p>
          </div>
        </div>

        <button
          className="profile-dashboard-btn"
          onClick={() => navigate("/doctor-dashboard")}
        >
          Dashboard
        </button>
      </header>

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="profile-content">
        {/* =================================================
            PATIENT HERO
            ================================================= */}

        <section className="profile-hero">
          <div className="profile-avatar">
            {String(patient.name || "P")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-identity">
            <h2>{patient.name || "Unknown Patient"}</h2>

            <p>Patient ID: {patient.id || patient._id || id}</p>
          </div>

          <div className="profile-status">
            <span></span>
            Patient Record
          </div>
        </section>

        {/* =================================================
            PERSONAL INFORMATION
            ================================================= */}

        <section className="profile-section">
          <div className="profile-section-title">
            <div className="section-icon">👤</div>

            <div>
              <h2>Personal Information</h2>

              <p>Basic patient details</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span>Full Name</span>

              <strong>{patient.name || "—"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Age</span>

              <strong>{patient.age ? `${patient.age} years` : "—"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Gender</span>

              <strong>{patient.gender || "—"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Phone</span>

              <strong>{patient.phone || "—"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Language</span>

              <strong>{patient.language || "—"}</strong>
            </div>
          </div>
        </section>

        {/* =================================================
            SYMPTOMS
            ================================================= */}

        <section className="profile-section">
          <div className="profile-section-title">
            <div className="section-icon">🩺</div>

            <div>
              <h2>Symptoms & Complaint</h2>

              <p>Information provided by the patient</p>
            </div>
          </div>

          <div className="complaint-box">
            <span>Main Problem</span>

            <h3>
              {patient.main_problem || patient.mainProblem || "Not provided"}
            </h3>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span>Duration</span>

              <strong>{patient.duration || "—"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Severity</span>

              <strong>
                <span
                  className={`profile-severity ${String(
                    patient.severity || "",
                  ).toLowerCase()}`}
                >
                  {patient.severity || "Not specified"}
                </span>
              </strong>
            </div>
          </div>

          <div className="other-symptoms">
            <span>Other Symptoms</span>

            <p>
              {patient.other_symptoms ||
                patient.otherSymptoms ||
                "No additional symptoms reported."}
            </p>
          </div>
        </section>

        {/* =================================================
            AI INTERVIEW
            ================================================= */}

        <section className="profile-section">
          <div className="profile-section-title">
            <div className="section-icon">🤖</div>

            <div>
              <h2>AI Interview</h2>

              <p>Responses collected during AI assessment</p>
            </div>
          </div>

          {aiInterview.length > 0 ? (
            <div className="profile-interview">
              {aiInterview.map((item, index) => (
                <div className="profile-interview-item" key={index}>
                  <div className="question-number">Q{index + 1}</div>

                  <div className="interview-content">
                    <h3>{item.question || `Question ${index + 1}`}</h3>

                    <p>{item.answer || "No answer provided."}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-empty-small">
              No AI interview responses available.
            </div>
          )}
        </section>

        {/* =================================================
            MEDICAL HISTORY
            ================================================= */}

        <section className="profile-section">
          <div className="profile-section-title">
            <div className="section-icon">📋</div>

            <div>
              <h2>Medical History</h2>

              <p>Previous medical information</p>
            </div>
          </div>

          <div className="history-grid">
            <div className="history-box">
              <span>Previous Illnesses</span>

              <p>{patient.illnesses || "No information provided."}</p>
            </div>

            <div className="history-box">
              <span>Current Medicines</span>

              <p>{patient.medicines || "No information provided."}</p>
            </div>

            <div className="history-box">
              <span>Allergies</span>

              <p>{patient.allergies || "No information provided."}</p>
            </div>

            <div className="history-box">
              <span>Previous Surgeries</span>

              <p>{patient.surgeries || "No information provided."}</p>
            </div>

            <div className="history-box">
              <span>Family History</span>

              <p>
                {patient.family_history ||
                  patient.familyHistory ||
                  "No information provided."}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            CLOUDINARY MEDICAL REPORT
            ================================================= */}

        <section className="profile-section">
          <div className="profile-section-title">
            <div className="section-icon">📄</div>

            <div>
              <h2>Medical Report</h2>

              <p>Uploaded document</p>
            </div>
          </div>

          {reportUrl ? (
            <div className="report-card">
              <div className="report-icon">📄</div>

              <div className="report-details">
                <h3>Medical Report PDF</h3>

                <p>Stored securely on Cloudinary</p>
              </div>

              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="report-btn"
              >
                Open PDF ↗
              </a>
            </div>
          ) : (
            <div className="profile-empty-small">
              No medical report uploaded.
            </div>
          )}
        </section>

        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="profile-footer">
          <button
            className="profile-back-btn"
            onClick={() => navigate("/doctor-dashboard")}
          >
            ← Back to Patient List
          </button>
        </div>
      </main>
    </div>
  );
}

export default PatientProfile;
