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
};

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(() => {
    const savedData = localStorage.getItem("medikiosk_patient");

    if (savedData) {
      return JSON.parse(savedData);
    }

    return { ...emptyPatient };
  });

  useEffect(() => {
    localStorage.setItem("medikiosk_patient", JSON.stringify(patient));
  }, [patient]);

  const updatePatient = (field, value) => {
    setPatient((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const setPatientData = (data) => {
    setPatient((previous) => ({
      ...previous,
      ...data,
    }));
  };

  const clearPatient = () => {
    setPatient({ ...emptyPatient });
    localStorage.removeItem("medikiosk_patient");
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        updatePatient,
        setPatientData,
        clearPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
