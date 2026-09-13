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

  // AI interview answers
  aiInterview: [],
};

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(() => {
    const savedData = localStorage.getItem("medikiosk_patient");

    if (savedData) {
      try {
        return {
          ...emptyPatient,
          ...JSON.parse(savedData),

          // File cannot be stored in localStorage
          reportFile: null,
        };
      } catch (error) {
        console.error("Failed to load patient data:", error);
      }
    }

    return {
      ...emptyPatient,
    };
  });

  // -----------------------------
  // SAVE DATA TO LOCAL STORAGE
  // -----------------------------

  useEffect(() => {
    const dataToSave = {
      ...patient,

      // File object cannot be stored
      reportFile: null,
    };

    localStorage.setItem("medikiosk_patient", JSON.stringify(dataToSave));
  }, [patient]);

  // -----------------------------
  // UPDATE ONE FIELD
  // -----------------------------

  const updatePatient = (field, value) => {
    setPatient((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // -----------------------------
  // UPDATE MULTIPLE FIELDS
  // -----------------------------

  const setPatientData = (data) => {
    setPatient((previous) => ({
      ...previous,
      ...data,
    }));
  };

  // -----------------------------
  // CLEAR PATIENT
  // -----------------------------

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
