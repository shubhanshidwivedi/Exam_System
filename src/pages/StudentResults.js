import React, { useEffect, useState } from "react";
import { studentAPI } from "../services/api";

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD RESULTS =================
  const loadResults = async () => {
    try {
      const res = await studentAPI.getMyAttempts();
      setAttempts(res.data || []);
    } catch (err) {
      console.error("Results API Error:", err);
      setError("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();  
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 80 }}>
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Results</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {attempts.length === 0 ? (
        <p>No attempts yet</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Score</th>
              <th>Total Marks</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((a) => (
              <tr key={a.id}>
                <td>{a.examTitle || "N/A"}</td>
                <td>{a.score ?? 0}</td>
                <td>{a.totalMarks ?? 0}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: a.passed ? "#d4edda" : "#f8d7da",
                      color: a.passed ? "#155724" : "#721c24",
                      fontWeight: "bold",
                    }}
                  >
                    {a.passed ? "Passed" : "Failed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentResults;
