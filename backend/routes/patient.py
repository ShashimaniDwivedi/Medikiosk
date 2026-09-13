import os
import uuid
import json

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

from sqlalchemy.orm import Session

from database.connection import get_db
from models.patient import Patient
from schemas.patient import PatientCreate


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


UPLOAD_DIR = "uploads"


# Make sure uploads folder exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================================================
# UPLOAD PDF
# =========================================================

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

    # Get extension
    file_extension = os.path.splitext(
        file.filename
    )[1]

    # Unique filename
    unique_filename = (
        f"{uuid.uuid4()}{file_extension}"
    )

    # Full path
    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    # Save file
    with open(file_path, "wb") as buffer:

        buffer.write(
            await file.read()
        )

    return {

        "success": True,

        "message": "PDF uploaded successfully",

        "filename": unique_filename,

        "original_filename": file.filename,

        "url": f"/uploads/{unique_filename}"
    }


# =========================================================
# SAVE PATIENT
# =========================================================

@router.post("")
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db)
):

    try:

        # Convert AI interview list
        # into JSON string for PostgreSQL
        ai_interview_json = json.dumps(
            payload.aiInterview,
            ensure_ascii=False
        )


        patient = Patient(

            # -------------------------
            # Patient Details
            # -------------------------

            language=payload.language,

            name=payload.name,

            age=payload.age,

            gender=payload.gender,

            phone=payload.phone,


            # -------------------------
            # Symptoms
            # -------------------------

            main_problem=payload.mainProblem,

            duration=payload.duration,

            severity=payload.severity,

            other_symptoms=payload.otherSymptoms,


            # -------------------------
            # Medical History
            # -------------------------

            illnesses=payload.illnesses,

            medicines=payload.medicines,

            allergies=payload.allergies,

            surgeries=payload.surgeries,

            family_history=payload.familyHistory,


            # -------------------------
            # Medical Report
            # -------------------------

            reports=payload.reports,


            # -------------------------
            # AI Interview
            # -------------------------

            ai_interview=ai_interview_json
        )


        # Add to database
        db.add(patient)

        # Save
        db.commit()

        # Get generated ID
        db.refresh(patient)


        return {

            "success": True,

            "message": "Patient saved successfully",

            "patient_id": patient.id,

            "ai_questions_saved": len(
                payload.aiInterview
            )
        }


    except Exception as error:

        db.rollback()

        print(
            "Patient save error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================================================
# GET ALL PATIENTS
# =========================================================

@router.get("")
def get_patients(
    db: Session = Depends(get_db)
):

    return db.query(
        Patient
    ).all()