import { usePatient } from "../context/usePatient";

function ReportUpload() {
  const { patient, setPatient } = usePatient();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check PDF
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      e.target.value = "";
      return;
    }

    // Check 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    // Store PDF in patient context
    setPatient((prev) => ({
      ...prev,
      reportFile: file,
      reports: file.name,
    }));
  };

  return (
    <div className="report-upload">
      <label htmlFor="medical-report">Medical Report</label>

      <input
        id="medical-report"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {patient.reportFile && (
        <div className="selected-report">
          <p>📄 Selected PDF:</p>

          <strong>{patient.reportFile.name}</strong>

          <p>Size: {(patient.reportFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
}

export default ReportUpload;
