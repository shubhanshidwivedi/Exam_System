import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  const [availableExams, setAvailableExams] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await studentAPI.getDashboard();
      console.log("DASHBOARD RESPONSE:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      const data = res.data.data || {};

      //  HANDLE BOTH LIST + COUNT RESPONSE
      if (Array.isArray(data.availableExams)) {
        setAvailableExams(data.availableExams);
      } else if (typeof data.availableExams === "number") {
        // fallback → fetch exams list separately
        const examsRes = await studentAPI.getAvailableExams();
        setAvailableExams(Array.isArray(examsRes.data) ? examsRes.data : []);
      } else {
        setAvailableExams([]);
      }

      if (Array.isArray(data.myAttempts)) {
        setMyAttempts(data.myAttempts);
      } else {
        const attemptsRes = await studentAPI.getMyAttempts();
        setMyAttempts(Array.isArray(attemptsRes.data) ? attemptsRes.data : []);
      }

    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 100 }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="card-title">
        Welcome, {user?.fullName || "Student"}!
      </h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* ================= STATS ================= */}
      <div className="grid grid-2 mb-20">

        <div className="card">
          <h2>Available Exams</h2>
          <p style={{ fontSize: 40, color: "#3498db" }}>
            {availableExams.length}
          </p>
          <Link to="/student/exams" className="btn btn-primary">
            View All Exams
          </Link>
        </div>

        <div className="card">
          <h2>My Attempts</h2>
          <p style={{ fontSize: 40, color: "#27ae60" }}>
            {myAttempts.length}
          </p>
          <Link to="/student/my-results" className="btn btn-success">
            View Results
          </Link>
        </div>

      </div>

      {/* ================= RECENT EXAMS ================= */}
      <div className="card">
        <h2>Recent Exams</h2>

        {availableExams.length === 0 ? (
          <p>No exams available at the moment.</p>
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
              {availableExams.slice(0, 5).map((exam) => {
                const alreadyAttempted = myAttempts.some(
                  (a) =>
                    a.examId === exam.id ||
                    a.exam?.id === exam.id ||
                    a.examTitle === exam.title
                );

                return (
                  <tr key={exam.id}>
                    <td>{exam.title}</td>
                    <td>{exam.durationMinutes} min</td>
                    <td>{exam.totalMarks}</td>

                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            exam.status === "ACTIVE"
                              ? "#28a745"
                              : exam.status === "UPCOMING"
                              ? "#f0ad4e"
                              : exam.status === "EXPIRED"
                              ? "#dc3545"
                              : "#6c757d",
                        }}
                      >
                        {exam.status}
                      </span>
                    </td>

                    <td>
                      {alreadyAttempted ? (
                        <span style={{ color: "#999" }}>Already Attempted</span>
                      ) : exam.status !== "ACTIVE" ? (
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
    </div>
  );
};

export default StudentDashboard;
