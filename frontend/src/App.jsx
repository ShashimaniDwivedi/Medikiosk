import { BrowserRouter, Routes, Route } from "react-router-dom";

import LanguageSelection from "./pages/LanguageSelection";
import Consent from "./pages/Consent";
import PatientDetails from "./pages/PatientDetails";
import Symptoms from "./pages/Symptoms";
import MedicalHistory from "./pages/MedicalHistory";
import Review from "./pages/Review";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />

        <Route path="/consent" element={<Consent />} />

        <Route path="/patient-details" element={<PatientDetails />} />

        <Route path="/symptoms" element={<Symptoms />} />

        <Route path="/medical-history" element={<MedicalHistory />} />

        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
