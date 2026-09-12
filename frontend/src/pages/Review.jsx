import { useState } from "react";
import { usePatient } from "../context/usePatient";

function Review() {
  const { patient, setPatientData } = usePatient();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let reportUrl = patient.reports || "";

      // ==========================================
      // 1. PDF → Node Backend → Cloudinary
      // ==========================================

      if (patient.reportFile) {
        const formData = new FormData();

        formData.append("pdf", patient.reportFile);

        console.log("Uploading PDF...");

        const uploadResponse = await fetch(
          "http://localhost:5000/api/pdf/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "PDF upload failed");
        }

        console.log("Cloudinary Response:", uploadData);

        // Cloudinary URL
        reportUrl = uploadData.url;

        // Context mein URL save
        setPatientData({
          reports: reportUrl,
        });
      }

      // ==========================================
      // 2. Patient Data → Python Backend
      // ==========================================

      const patientData = {
        language: patient.language || "",

        name: patient.name || "",
        age: patient.age || "",
        gender: patient.gender || "",
        phone: patient.phone || "",

        mainProblem: patient.mainProblem || "",
        duration: patient.duration || "",
        severity: patient.severity || "",
        otherSymptoms: patient.otherSymptoms || "",

        illnesses: patient.illnesses || "",
        medicines: patient.medicines || "",
        allergies: patient.allergies || "",
        surgeries: patient.surgeries || "",
        familyHistory: patient.familyHistory || "",

        // Cloudinary URL
        reports: reportUrl,
      };

      console.log("Sending patient data:", patientData);

      const response = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit patient information");
      }

      console.log("Python Backend Response:", data);

      alert("Patient information submitted successfully!");
    } catch (error) {
      console.error("Submit Error:", error);

      alert(error.message || "Failed to submit information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="logo">📋</div>

        <h1>Review Your Information</h1>

        <p>Please review your information before submitting.</p>

        {/* ================= LANGUAGE ================= */}

        <div className="review-section">
          <h2>Language</h2>

          <div className="info-row">
            <span>Selected Language</span>

            <strong>{patient.language || "Not provided"}</strong>
          </div>
        </div>

        {/* ================= PATIENT DETAILS ================= */}

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

        {/* ================= SYMPTOMS ================= */}

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

        {/* ================= MEDICAL HISTORY ================= */}

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

          {/* ================= PDF ================= */}

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

        {/* ================= SUBMIT ================= */}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading Report..." : "Submit Information ✓"}
        </button>
      </div>
    </div>
  );
}

export default Review;
