import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { usePatient } from "../context/PatientContext";
import { usePatient } from "../context/usePatient";

function PatientDetails() {
  const navigate = useNavigate();

  const { patient, setPatientData } = usePatient();

  const [formData, setFormData] = useState({
    name: patient.name || "",
    age: patient.age || "",
    gender: patient.gender || "",
    phone: patient.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPatientData(formData);

    navigate("/symptoms");
  };

  return (
    <div className="patient-page">
      <div className="patient-card">
        <div className="logo">👤</div>

        <h1>Patient Details</h1>

        <p>Please enter your basic information</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientDetails;
