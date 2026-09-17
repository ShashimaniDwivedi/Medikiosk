from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.connection import Base, engine
from models import patient
from routes.patient import router as patient_router
from routes.ai.ai import router as ai_router


# =========================
# Create Database Tables
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FastAPI App
# =========================

app = FastAPI(
    title="MediKiosk API",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medikiosk-a5yn.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Serve Uploaded Files
# =========================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# =========================
# Patient Routes
# =========================

app.include_router(patient_router)


# =========================
# AI Routes
# =========================

app.include_router(ai_router)


# =========================
# Home Route
# =========================

@app.get("/")
def home():
    return {
        "message": "MediKiosk Backend is running"
    }