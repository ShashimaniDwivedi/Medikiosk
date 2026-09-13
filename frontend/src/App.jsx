import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LanguageSelection from "./pages/LanguageSelection";
import Consent from "./pages/Consent";
import PatientDetails from "./pages/PatientDetails";
import Symptoms from "./pages/Symptoms";
import AIInterview from "./pages/AIInterview";
import MedicalHistory from "./pages/MedicalHistory";
import Review from "./pages/Review";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientProfile from "./pages/PatientProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />

        <Route path="/consent" element={<Consent />} />

        <Route path="/patient-details" element={<PatientDetails />} />

        <Route path="/symptoms" element={<Symptoms />} />

        <Route path="/ai-interview" element={<AIInterview />} />

        <Route path="/medical-history" element={<MedicalHistory />} />

        <Route path="/review" element={<Review />} />

        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        <Route path="/patient/:id" element={<PatientProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
