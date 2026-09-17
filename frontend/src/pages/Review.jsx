import { useState } from "react";
import { usePatient } from "../context/usePatient";
import { useNavigate } from "react-router-dom";

function Review() {
  const { patient, setPatientData, clearPatient } = usePatient();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {
    // Prevent double click
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // UPLOAD PDF / IMAGE TO CLOUDINARY
      // =================================================

      let reportUrl = patient.reports || "";

      if (patient.reportFile) {
        const formData = new FormData();

        // IMPORTANT:
        // This MUST match upload.single("file")
        // in pdfRoutes.js

        formData.append("file", patient.reportFile);

        const uploadResponse = await fetch(
          `${import.meta.env.VITE_UPLOAD_URL}/api/pdf/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Medical report upload failed");
        }

        // Cloudinary URL

        reportUrl = uploadData.url;

        console.log("Cloudinary URL:", reportUrl);

        // Save URL in React state

        setPatientData({
          reports: reportUrl,
        });
      }

      // =================================================
      // PATIENT DATA
      // =================================================

      const patientData = {
        // =================================================
        // LANGUAGE
        // =================================================

        // language: patient.language || "",

        // =================================================
        // PATIENT DETAILS
        // =================================================

        name: patient.name || "",

        age: patient.age ? Number(patient.age) : null,

        gender: patient.gender || "",

        phone: patient.phone || "",

        // =================================================
        // SYMPTOMS
        // =================================================

        mainProblem: patient.mainProblem || "",

        duration: patient.duration || "",

        severity: patient.severity || "",

        otherSymptoms: patient.otherSymptoms || "",

        // =================================================
        // MEDICAL HISTORY
        // =================================================

        illnesses: patient.illnesses || "",

        medicines: patient.medicines || "",

        allergies: patient.allergies || "",

        surgeries: patient.surgeries || "",

        familyHistory: patient.familyHistory || "",

        // =================================================
        // MEDICAL REPORT
        // =================================================

        reports: reportUrl,

        // =================================================
        // AI INTERVIEW
        // =================================================

        aiInterview: patient.aiInterview || [],
      };

      console.log("Sending patient data:", patientData);

      // =================================================
      // SEND TO FASTAPI
      // =================================================

      fetch(`${import.meta.env.VITE_API_URL}/patients`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      // =================================================
      // FASTAPI ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit patient information");
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(`Patient information submitted successfully!\n`);

      console.log("Patient saved:", data);

      // =================================================
      // CLEAR PATIENT DATA
      // =================================================

      // Important for kiosk.
      // Next patient will get an empty form.

      clearPatient();

      // =================================================
      // GO TO FIRST PAGE
      // =================================================

      navigate("/");
    } catch (error) {
      console.error("Submit Error:", error);

      alert(error.message || "Failed to submit information");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="review-page">
      <div className="review-card">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="logo">📋</div>

        <h1>Review Your Information</h1>

        <p>Please review your information before submitting.</p>

        {/* =================================================
            PATIENT DETAILS
        ================================================= */}

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

        {/* =================================================
            SYMPTOMS
        ================================================= */}

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

        {/* =================================================
            MEDICAL HISTORY
        ================================================= */}

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

          {/* =================================================
              MEDICAL REPORT
          ================================================= */}

          <div className="info-row">
            <span>Medical Report</span>

            <strong>
              {patient.reportFile
                ? patient.reportFile.name
                : patient.reports
                  ? "Report uploaded"
                  : "No file uploaded"}
            </strong>
          </div>
        </div>

        {/* =================================================
            AI INTERVIEW
        ================================================= */}

        <div className="review-section">
          <h2>🤖 AI Interview</h2>

          {patient.aiInterview && patient.aiInterview.length > 0 ? (
            patient.aiInterview.map((item, index) => (
              <div className="answer-item" key={index}>
                <strong>
                  Q{index + 1}. {item.question}
                </strong>

                <p>{item.answer}</p>
              </div>
            ))
          ) : (
            <p>No AI interview responses.</p>
          )}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="review-buttons">
          <button
            className="back-btn"
            onClick={() => navigate("/medical-history")}
            disabled={loading}
          >
            ← Back
          </button>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit Information ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Review;
