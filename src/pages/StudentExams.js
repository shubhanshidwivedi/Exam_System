import React, { useEffect, useState } from "react";
import { studentAPI } from "../services/api";
import { Link } from "react-router-dom";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= AUTO REFRESH =================
  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000); // refresh every 30 sec

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [examsRes, attemptsRes] = await Promise.all([
        studentAPI.getAvailableExams(),
        studentAPI.getMyAttempts(),
      ]);

      setExams(examsRes.data || []);
      setAttempts(attemptsRes.data || []);
    } catch (err) {
      console.error("Load Exams Error:", err);
      setError("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS LOGIC =================
  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.startTime + "Z");
const end = new Date(exam.endTime + "Z");


    if (now < start) return "UPCOMING";
    if (now > end) return "EXPIRED";
    return "ACTIVE";
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 100 }}>
        <h2>Loading Exams...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Available Exams</h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <p>No exams available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => {
              const status = getExamStatus(exam);

              const alreadyAttempted = attempts.some(
                (a) => a.examId === exam.id || a.exam?.id === exam.id
              );

              return (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.durationMinutes} min</td>
                  <td>{exam.totalMarks}</td>

                  {/* STATUS BADGE */}
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          status === "ACTIVE"
                            ? "#28a745"
                            : status === "UPCOMING"
                            ? "#f0ad4e"
                            : "#dc3545",
                      }}
                    >
                      {status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    {alreadyAttempted ? (
                      <span style={{ color: "#888" }}>Already Attempted</span>
                    ) : status !== "ACTIVE" ? (
                      <span style={{ color: "#aaa" }}>Not Available</span>
                    ) : (
                      <Link
                        to={`/student/exam/${exam.id}`}
                        className="btn btn-primary"
                      >
                        Start Exam
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentExams;
