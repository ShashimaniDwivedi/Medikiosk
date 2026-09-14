from pydantic import BaseModel
from typing import List, Dict, Any


class PatientCreate(BaseModel):

    language: str = ""

    name: str
    age: int | None = None
    gender: str = ""
    phone: str = ""

    # Symptoms
    mainProblem: str = ""
    duration: str = ""
    severity: str = ""
    otherSymptoms: str = ""

    # Medical History
    illnesses: str = ""
    medicines: str = ""
    allergies: str = ""
    surgeries: str = ""
    familyHistory: str = ""

    # Medical Report
    reports: str = ""

    # AI Interview
    aiInterview: List[Dict[str, Any]] = []

    # Viewed status
    viewed: bool = False