import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { adminAPI } from "../services/api";

const AdminExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      const res = await adminAPI.getExamById(id);
      setExam(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load exam");
      navigate("/admin/exams");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 80 }}>
        <h2>Loading exam...</h2>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 80 }}>
        <h2>Exam not found</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="card-title">Exam Details</h1>

      {/* ===== EXAM INFO ===== */}
      <div className="card">
        <h2>{exam.title}</h2>

        <p><b>Description:</b> {exam.description || "N/A"}</p>
        <p><b>Duration:</b> {exam.durationMinutes} minutes</p>
        <p><b>Total Marks:</b> {exam.totalMarks}</p>
        <p><b>Passing Marks:</b> {exam.passingMarks}</p>

        <p>
          <b>Status:</b>{" "}
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              background: exam.isActive ? "#d4edda" : "#f8d7da",
              color: exam.isActive ? "#155724" : "#721c24",
              fontWeight: "bold",
            }}
          >
            {exam.isActive ? "Active" : "Inactive"}
          </span>
        </p>

        <p><b>Start Time:</b> {exam.startTime}</p>
        <p><b>End Time:</b> {exam.endTime}</p>

        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/exams")}
            style={{ marginRight: 10 }}
          >
            Back
          </button>

          <Link to={`/admin/edit-exam/${exam.id}`} className="btn btn-warning">
            Edit Exam
          </Link>
        </div>
      </div>

      {/* ===== QUESTIONS ===== */}
      <div className="card">
        <h2>Questions</h2>

        {(!exam.questions || exam.questions.length === 0) ? (
          <p>No questions found.</p>
        ) : (
          exam.questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: 25 }}>
              <h3>
                Q{index + 1}. {q.questionText}
              </h3>

              <p>
                <b>Type:</b> {q.type} | <b>Marks:</b> {q.marks}
              </p>

              <ul>
                {q.options.map((opt) => (
                  <li
                    key={opt.id}
                    style={{
                      color: opt.isCorrect ? "green" : "#333",
                      fontWeight: opt.isCorrect ? "bold" : "normal",
                    }}
                  >
                    {opt.optionText} {opt.isCorrect && "✔"}
                  </li>
                ))}
              </ul>

              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExamDetails;
