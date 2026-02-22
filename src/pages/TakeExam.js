import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentAPI } from "../services/api";

const TakeExam = () => {
  const [message, setMessage] = useState("");
  const { examId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);

  // ===== PROCTOR MODE =====
  const [violations, setViolations] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const MAX_VIOLATIONS = 3;

  // ================= HIDE NAVBAR DURING EXAM (ADDED) =================
  useEffect(() => {
    const navbar = document.querySelector(".navbar"); // 👈 ensure navbar class is correct
    if (navbar) navbar.style.display = "none";

    return () => {
      if (navbar) navbar.style.display = "";
    };
  }, []);

  // ================= STOP CAMERA =================
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      console.log("📷 Camera stopped");
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    if (examStarted && expiresAt) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(expiresAt).getTime();
        const remaining = Math.max(0, expiry - now);

        setTimeLeft(Math.floor(remaining / 1000));

        if (remaining <= 0) {
          handleSubmit(true);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, expiresAt]);

  // ================= CAMERA + MIC =================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraStream(stream);
    } catch (err) {
      alert("Camera & Mic permission is required to start exam");
      throw err;
    }
  };

  // ================= FULLSCREEN =================
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
  };

  const exitFullscreenCheck = () => {
    if (!document.fullscreenElement && examStarted) {
      logViolation("FULLSCREEN_EXIT");
    }
  };

  // ================= VIOLATION =================
  const logViolation = async (type) => {
    try {
      const newCount = violations + 1;
      setViolations(newCount);

      await studentAPI.logViolation(attemptId, type);

      if (newCount >= MAX_VIOLATIONS) {
        alert("Too many violations. Exam auto submitted.");
        handleSubmit(true);
      }
    } catch (err) {
      console.error("Violation log error", err);
    }
  };

  // ================= TAB SWITCH =================
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && examStarted) {
        logViolation("TAB_SWITCH");
      }
    };

    const handleFullscreen = () => exitFullscreenCheck();

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, [examStarted, violations]);

  // ================= CAMERA OFF =================
  useEffect(() => {
    if (!cameraStream) return;

    const videoTrack = cameraStream.getVideoTracks()[0];

    const checkCamera = setInterval(() => {
      if (!videoTrack.enabled && examStarted) {
        logViolation("CAMERA_OFF");
      }
    }, 3000);

    return () => clearInterval(checkCamera);
  }, [cameraStream, examStarted]);

  // ================= AUTO STOP CAMERA ON PAGE LEAVE =================
  useEffect(() => {
    return () => stopCamera();
  }, [cameraStream]);

  // ================= START EXAM =================
  const startExam = async () => {
    setLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera/Mic not supported in this browser");
      }

      let stream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (camErr) {
        throw new Error("Camera & Mic permission denied");
      }

      setCameraStream(stream);

      try {
        const elem = document.documentElement;
        await elem.requestFullscreen();
      } catch (fsErr) {
        throw new Error("Fullscreen permission denied");
      }

      if (!document.fullscreenElement) {
        throw new Error("Fullscreen is required to start exam");
      }

      const response = await studentAPI.startExam(examId);
      const { attemptId, expiresAt, questions } = response.data;

      setAttemptId(attemptId);
      setExpiresAt(expiresAt);
      setQuestions(questions);
      setExamStarted(true);

      const initialAnswers = {};
      questions.forEach((q) => (initialAnswers[q.id] = []));
      setAnswers(initialAnswers);

    } catch (error) {
      alert(error.response?.data?.message || error.message || "Cannot start exam");
      navigate("/student/exams");
    } finally {
      setLoading(false);
    }
  };

  // ================= ANSWER =================
  const handleAnswerChange = async (questionId, optionId, isMultiple) => {
    let newAnswer;

    if (isMultiple) {
      const current = answers[questionId] || [];
      newAnswer = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
    } else {
      newAnswer = [optionId];
    }

    setAnswers({ ...answers, [questionId]: newAnswer });

    try {
      await studentAPI.submitAnswer(attemptId, {
        questionId,
        selectedOptionIds: newAnswer,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (auto = false) => {
    if (!auto && !window.confirm("Are you sure you want to submit the exam?")) {
      return;
    }

    setLoading(true);
    try {
      await studentAPI.submitExam(attemptId);

      stopCamera();

      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      navigate("/student/my-results");

    } catch (error) {
      alert(error.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!examStarted) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: "600px", margin: "100px auto" }}>
          <h2>Ready to Start Exam?</h2>
          <p style={{ color: "red" }}>
            ⚠ Camera + Mic + Fullscreen required. Do not switch tab or exit fullscreen.
          </p>
          <button onClick={startExam} className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Starting..." : "Start Exam"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={`timer ${timeLeft < 300 ? (timeLeft < 60 ? "danger" : "warning") : ""}`}>
        Time Left: {formatTime(timeLeft)}
      </div>

      <h2>Exam in Progress</h2>

      {questions.map((question, index) => (
        <div key={question.id} className="question-card">
          <div className="question-header">
            <span>Question {index + 1}</span>
            <span>{question.marks} marks</span>
          </div>

          <div className="question-text">{question.questionText}</div>

          {question.options.map((option) => {
            const isMultiple = question.type === "MULTIPLE_CHOICE";
            const isSelected = (answers[question.id] || []).includes(option.id);

            return (
              <div
                key={option.id}
                className={`option ${isSelected ? "selected" : ""}`}
                onClick={() => handleAnswerChange(question.id, option.id, isMultiple)}
              >
                <input type={isMultiple ? "checkbox" : "radio"} checked={isSelected} readOnly />
                {option.optionText}
              </div>
            );
          })}
        </div>
      ))}

      <div className="text-center mb-20">
        <button onClick={() => handleSubmit(false)} className="btn btn-success" disabled={loading}>
          {loading ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </div>
  );
};

export default TakeExam;
