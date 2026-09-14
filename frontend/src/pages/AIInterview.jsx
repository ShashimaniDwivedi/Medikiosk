import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../context/usePatient";

function AIInterview() {
  const { patient, setPatientData } = usePatient();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);

  // Backend decides the total number of questions
  // It will be between 5 and 10
  const [totalQuestions, setTotalQuestions] = useState(null);

  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  // =====================================================
  // START AI INTERVIEW
  // =====================================================

  const startInterview = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/ai/start", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          language: patient.language || "English",

          mainProblem: patient.mainProblem || "",

          duration: patient.duration || "",

          severity: patient.severity || "",

          otherSymptoms: patient.otherSymptoms || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to start interview");
      }

      // =================================================
      // FIRST AI QUESTION
      // =================================================

      setQuestion(data.question);

      setQuestionNumber(data.question_number);

      // Backend may not know the final number yet.
      // It will become available when the interview finishes.
      setTotalQuestions(data.total_questions || null);

      setStarted(true);

      setFinished(false);

      setHistory([]);

      setAnswer("");
    } catch (error) {
      console.error("Start Interview Error:", error);

      alert(error.message || "Unable to start interview");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUBMIT ANSWER
  // =====================================================

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    try {
      setLoading(true);

      // Current question + current answer
      const currentItem = {
        question: question,
        answer: answer.trim(),
      };

      // Add current answer to complete history
      const currentHistory = [...history, currentItem];

      const response = await fetch("http://127.0.0.1:8000/ai/answer", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question_number: questionNumber,

          question: question,

          answer: answer.trim(),

          // Previous Q/A history
          history: history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get next question");
      }

      // =================================================
      // SAVE CURRENT ANSWER
      // =================================================

      setHistory(currentHistory);

      // =================================================
      // BACKEND DECIDED TOTAL QUESTIONS
      // =================================================

      if (data.total_questions) {
        setTotalQuestions(data.total_questions);
      }

      // =================================================
      // INTERVIEW FINISHED
      // =================================================

      if (data.finished) {
        setFinished(true);

        setPatientData({
          aiInterview: currentHistory,
        });

        setAnswer("");

        return;
      }

      // =================================================
      // NEXT QUESTION
      // =================================================

      setQuestion(data.question);

      setQuestionNumber(data.question_number);

      setAnswer("");
    } catch (error) {
      console.error("Answer Error:", error);

      alert(error.message || "Unable to get next question");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CONTINUE TO MEDICAL HISTORY
  // =====================================================

  const continueToMedicalHistory = () => {
    navigate("/medical-history");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="ai-interview-page">
      <div className="ai-interview-card">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="ai-header">
          <div className="ai-logo">🤖</div>

          <div>
            <h1>MediKiosk AI Interview</h1>

            <p>Answer a few simple questions about your health.</p>
          </div>
        </div>

        {/* =================================================
            START SCREEN
        ================================================= */}

        {!started && !finished && (
          <div className="start-section">
            <h2>Ready to begin?</h2>

            <p>
              MediKiosk will ask questions based on your symptoms and previous
              answers.
            </p>

            <p>
              The number of questions will adapt automatically based on your
              responses.
            </p>

            <button
              className="start-btn"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* =================================================
            QUESTION SCREEN
        ================================================= */}

        {started && !finished && (
          <div className="question-section">
            {/* Dynamic Progress */}

            <div className="progress">
              Question {questionNumber}
              {totalQuestions ? ` of ${totalQuestions}` : ""}
            </div>

            {/* Question */}

            <div className="question-box">
              <h2>{question}</h2>
            </div>

            {/* Answer */}

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              disabled={loading}
            />

            {/* Next */}

            <button
              className="answer-btn"
              onClick={submitAnswer}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Next →"}
            </button>
          </div>
        )}

        {/* =================================================
            FINISHED SCREEN
        ================================================= */}

        {finished && (
          <div className="finished-section">
            <div className="success-icon">✓</div>

            <h2>Interview Completed</h2>

            <p>Your responses have been recorded successfully.</p>

            {/* Final Question Count */}

            {totalQuestions && (
              <p>
                Interview completed with{" "}
                <strong>{totalQuestions} questions</strong>.
              </p>
            )}

            {/* Interview Summary */}

            <div className="answer-summary">
              <h3>Interview Summary</h3>

              {history.map((item, index) => (
                <div className="answer-item" key={index}>
                  <strong>
                    Q{index + 1}. {item.question}
                  </strong>

                  <p>{item.answer}</p>
                </div>
              ))}
            </div>

            {/* Continue */}

            <button className="answer-btn" onClick={continueToMedicalHistory}>
              Continue to Medical History →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIInterview;
