import os
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.patient import Patient
from schemas.patient import PatientCreate


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


UPLOAD_DIR = "uploads"


# -----------------------------
# UPLOAD PDF
# -----------------------------

@router.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...)
):
    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Create unique filename
    file_extension = os.path.splitext(file.filename)[1]

    unique_filename = (
        f"{uuid.uuid4()}{file_extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    # Save PDF
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "success": True,
        "message": "PDF uploaded successfully",
        "filename": unique_filename,
        "original_filename": file.filename,
        "url": f"/uploads/{unique_filename}"
    }


# -----------------------------
# SAVE PATIENT
# -----------------------------

@router.post("")
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db)
):

    patient = Patient(
        language=payload.language,
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        phone=payload.phone,

        main_problem=payload.mainProblem,
        duration=payload.duration,
        severity=payload.severity,
        other_symptoms=payload.otherSymptoms,

        illnesses=payload.illnesses,
        medicines=payload.medicines,
        allergies=payload.allergies,
        surgeries=payload.surgeries,
        family_history=payload.familyHistory,

        reports=payload.reports
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return {
        "success": True,
        "message": "Patient saved successfully",
        "patient_id": patient.id
    }


# -----------------------------
# GET ALL PATIENTS
# -----------------------------

@router.get("")
def get_patients(
    db: Session = Depends(get_db)
):
    return db.query(Patient).all()