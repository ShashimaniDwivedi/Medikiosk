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
    raise ValueError("GEMINI_API_KEY is missing in .env")


client = genai.Client(
    api_key=api_key
)


# =========================================================
# CONSTANTS
# =========================================================

MIN_QUESTIONS = 5
MAX_QUESTIONS = 10


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

1. The interview must contain BETWEEN 5 AND 10 questions.

2. NEVER finish the interview before 5 questions.

3. NEVER ask more than 10 questions.

4. Questions must be relevant to the patient's
   complaint and previous answers.

5. Do not ask random questions.

6. Do not unnecessarily repeat information
   already provided by the patient.

7. Use simple language that a normal patient
   can understand.

8. Adapt the next question according to:
   - Main problem
   - Duration
   - Severity
   - Other symptoms
   - Previous answers

9. Try to collect useful history such as:
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

10. Do not ask all topics in a fixed order.
    Choose the most relevant next question.

11. If the patient's answer requires an
    important follow-up question, ask that first.

12. Never diagnose the patient.

13. Never prescribe treatment.

14. Return ONLY ONE question when asked
    to generate a question.

15. Do not add explanations before or after
    the question.

16. Ask the question in the patient's
    selected language.
"""


# =========================================================
# START INTERVIEW
# =========================================================

@router.post("/start")
def start_interview(request: StartRequest):

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
            "question": response.text.strip(),
            "total_questions": None
        }

    except Exception as e:

        print("AI Start Error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# NEXT QUESTION / FINISH DECISION
# =========================================================

@router.post("/answer")
def next_question(request: AnswerRequest):

    try:

        current_number = request.question_number

        # =================================================
        # HARD MAXIMUM
        # =================================================

        if current_number >= MAX_QUESTIONS:

            return {
                "success": True,
                "finished": True,
                "total_questions": MAX_QUESTIONS,
                "message": "Interview completed"
            }


        # =================================================
        # BUILD CONVERSATION HISTORY
        # =================================================

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


        # =================================================
        # AFTER 5 QUESTIONS
        # AI DECIDES WHETHER TO FINISH
        # =================================================

        if current_number >= MIN_QUESTIONS:

            decision_prompt = f"""
You are controlling an adaptive medical history interview.

The interview must contain between 5 and 10 questions.

The patient has now answered question {current_number}.

PATIENT INTERVIEW HISTORY
-------------------------

{conversation}

Decide whether enough useful medical history has
been collected.

You may FINISH only if:
- At least 5 questions have been answered.
- The available information is reasonably sufficient.
- No important follow-up question is clearly needed.

You should CONTINUE if:
- An important symptom needs clarification.
- The patient's previous answer requires follow-up.
- Important relevant history is still missing.
- More information would meaningfully help a healthcare professional.

You MUST finish if question {current_number} is 10.

Return ONLY one word:

FINISH

or

CONTINUE
"""

            decision_response = client.models.generate_content(
                model="gemini-flash-lite-latest",
                contents=decision_prompt
            )

            decision = decision_response.text.strip().upper()

            # Remove accidental extra text
            if "FINISH" in decision:
                decision = "FINISH"
            elif "CONTINUE" in decision:
                decision = "CONTINUE"


            # =================================================
            # FINISH INTERVIEW
            # =================================================

            if decision == "FINISH":

                return {
                    "success": True,
                    "finished": True,
                    "total_questions": current_number,
                    "message": "Interview completed"
                }


        # =================================================
        # GENERATE NEXT QUESTION
        # =================================================

        next_number = current_number + 1

        prompt = f"""
{SYSTEM_PROMPT}

PATIENT'S INTERVIEW HISTORY
---------------------------

{conversation}

The patient has answered {current_number} questions.

The next question will be question {next_number}.

Generate the SINGLE most relevant question based
on everything the patient has said.

IMPORTANT:

- Do not repeat information already provided.
- Ask only one question.
- Keep it short and easy to understand.
- Make it relevant to the patient's complaint.
- Follow up on important information when necessary.
- Ask in the patient's language.
- Do not diagnose.
- Do not recommend treatment.
- The total interview must not exceed 10 questions.

Return ONLY the question.
"""

        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt
        )

        return {
            "success": True,
            "finished": False,
            "question_number": next_number,
            "question": response.text.strip(),
            "total_questions": None
        }

    except Exception as e:

        print("AI Answer Error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )