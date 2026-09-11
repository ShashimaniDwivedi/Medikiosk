import { useContext } from "react";
import { PatientContext } from "./context";

export const usePatient = () => {
  const context = useContext(PatientContext);

  if (!context) {
    throw new Error("usePatient must be used inside PatientProvider");
  }

  return context;
};
