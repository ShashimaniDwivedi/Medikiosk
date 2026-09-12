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

  // Cloudinary PDF URL
  reports: "",

  // Actual PDF file - local only
  reportFile: null,
};

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(() => {
    const savedData = localStorage.getItem("medikiosk_patient");

    if (savedData) {
      try {
        return {
          ...emptyPatient,
          ...JSON.parse(savedData),
          reportFile: null,
        };
      } catch (error) {
        console.error("Failed to load patient data:", error);
      }
    }

    return { ...emptyPatient };
  });

  // Save patient information to localStorage
  // BUT DON'T SAVE reportFile
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

  // Clear patient data
  const clearPatient = () => {
    setPatient({ ...emptyPatient });

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
