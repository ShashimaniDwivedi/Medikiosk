from typing import Optional
from pydantic import BaseModel


class PatientCreate(BaseModel):
    language: Optional[str] = None
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None

    mainProblem: Optional[str] = None
    duration: Optional[str] = None
    severity: Optional[str] = None
    otherSymptoms: Optional[str] = None

    illnesses: Optional[str] = None
    medicines: Optional[str] = None
    allergies: Optional[str] = None
    surgeries: Optional[str] = None
    familyHistory: Optional[str] = None

    reports: Optional[str] = None