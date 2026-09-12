from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.connection import Base, engine
from models import patient
from routes.patient import router as patient_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="MediKiosk API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve uploaded files
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# Patient routes
app.include_router(patient_router)


@app.get("/")
def home():
    return {
        "message": "MediKiosk Backend is running"
    }