import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


# =========================================================
# GEMINI CLIENT
# =========================================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is missing in .env"
    )


client = genai.Client(
    api_key=api_key
)


# =========================================================
# REQUEST MODELS
# =========================================================

class StartRequest(BaseModel):

    language: str = "English"

    mainProblem: str = ""

    duration: str = ""

    severity: str = ""

    otherSymptoms: str = ""


class AnswerRequest(BaseModel):

    question_number: int

    question: str

    answer: str

    history: list


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are MediKiosk, an AI clinical history-taking assistant.

Your ONLY job is to collect patient history.

You are NOT a doctor.

You must NOT:
- diagnose diseases
- suggest a diagnosis
- prescribe medicines
- recommend treatment
- make medical decisions

Your job is to ask short, simple and relevant
questions to collect information that can later
be reviewed by a healthcare professional.

IMPORTANT RULES:

1. Ask a maximum of 10 questions.

2. Questions must be relevant to the patient's
   complaint and previous answers.

3. Do not ask random questions.

4. Do not unnecessarily repeat information
   already provided by the patient.

5. Use simple language that a normal patient
   can understand.

6. Adapt the next question according to:
   - Main problem
   - Duration
   - Severity
   - Other symptoms
   - Previous answers

7. Try to collect useful history such as:
   - Main complaint
   - Duration
   - Severity
   - Associated symptoms
   - Previous illnesses
   - Current medicines
   - Allergies
   - Previous surgeries
   - Family history
   - Other relevant information

8. Do not ask all topics in a fixed order.
   Choose the most relevant next question.

9. If the patient's answer requires an
   important follow-up question, ask that first.

10. Never diagnose the patient.

11. Never prescribe treatment.

12. Return ONLY ONE question.

13. Do not add explanations before or after
    the question.

14. Ask the question in the patient's
    selected language.
"""


# =========================================================
# START INTERVIEW
# =========================================================

@router.post("/start")
def start_interview(
    request: StartRequest
):

    try:

        prompt = f"""
{SYSTEM_PROMPT}


PATIENT INFORMATION FROM THE SYMPTOMS FORM
-------------------------------------------

Preferred language:
{request.language}

Main problem:
{request.mainProblem}

Duration:
{request.duration}

Severity:
{request.severity}

Other symptoms:
{request.otherSymptoms}


This is the beginning of the interview.

The patient has already provided the information
above, so DO NOT ask for information that is
already clearly available.

Ask the FIRST most relevant follow-up question.

Return ONLY the question.
"""


        response = client.models.generate_content(

            model="gemini-flash-lite-latest",

            contents=prompt

        )


        return {

            "success": True,

            "question_number": 1,

            "question":
                response.text.strip()

        }


    except Exception as e:

        print(
            "AI Start Error:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# =========================================================
# NEXT QUESTION
# =========================================================

@router.post("/answer")
def next_question(
    request: AnswerRequest
):

    try:

        # -----------------------------------------------
        # Stop after question 10
        # -----------------------------------------------

        if request.question_number >= 10:

            return {

                "success": True,

                "finished": True,

                "message":
                    "Interview completed"

            }


        # -----------------------------------------------
        # Build conversation history
        # -----------------------------------------------

        conversation = ""


        for item in request.history:

            conversation += f"""

Question:
{item.get("question")}

Patient Answer:
{item.get("answer")}

"""


        # Add current question + answer

        conversation += f"""

Question:
{request.question}

Patient Answer:
{request.answer}

"""


        # -----------------------------------------------
        # Generate next question
        # -----------------------------------------------

        prompt = f"""
{SYSTEM_PROMPT}


PATIENT'S INTERVIEW HISTORY
---------------------------

{conversation}


The current question number is:

{request.question_number}


Generate the next most relevant question.

This will be question number:

{request.question_number + 1}


Important:

- Consider everything the patient has already said.
- Do not repeat questions unnecessarily.
- Ask only one question.
- Keep it short and easy to understand.
- Ask in the same language used by the patient.
- Do not diagnose.
- Do not recommend treatment.

Return ONLY the question.
"""


        response = client.models.generate_content(

            model="gemini-flash-lite-latest",

            contents=prompt

        )


        return {

            "success": True,

            "finished": False,

            "question_number":
                request.question_number + 1,

            "question":
                response.text.strip()

        }


    except Exception as e:

        print(
            "AI Answer Error:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )