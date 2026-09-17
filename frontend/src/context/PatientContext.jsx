import { useEffect, useState } from "react";
import { PatientContext } from "./context";

const emptyPatient = {
  language: "",

  name: "",
  age: "",
  gender: "",
  phone: "",

  mainProblem: "",
  duration: "",
  severity: "",
  otherSymptoms: "",

  illnesses: "",
  medicines: "",
  allergies: "",
  surgeries: "",
  familyHistory: "",

  reports: "",
  reportFile: null,

  aiInterview: [],
};

export const PatientProvider = ({ children }) => {
  // Always start with empty patient
  const [patient, setPatient] = useState({
    ...emptyPatient,
  });

  // Save current patient to localStorage
  useEffect(() => {
    const dataToSave = {
      ...patient,
      reportFile: null,
    };

    localStorage.setItem("medikiosk_patient", JSON.stringify(dataToSave));
  }, [patient]);

  // Update one field
  const updatePatient = (field, value) => {
    setPatient((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Update multiple fields
  const setPatientData = (data) => {
    setPatient((previous) => ({
      ...previous,
      ...data,
    }));
  };

  // Clear patient
  const clearPatient = () => {
    setPatient({
      ...emptyPatient,
    });

    localStorage.removeItem("medikiosk_patient");
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        setPatient,
        updatePatient,
        setPatientData,
        clearPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
