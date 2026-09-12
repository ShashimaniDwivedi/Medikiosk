from sqlalchemy import Column, Integer, String, Text
from database.connection import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    language = Column(String(50))
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(50))
    phone = Column(String(20))

    main_problem = Column(Text)
    duration = Column(String(100))
    severity = Column(String(30))
    other_symptoms = Column(Text)

    illnesses = Column(Text)
    medicines = Column(Text)
    allergies = Column(Text)
    surgeries = Column(Text)
    family_history = Column(Text)

    reports = Column(String(255))