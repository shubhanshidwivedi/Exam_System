import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto refresh whenever dashboard opens / route changes
  useEffect(() => {
    fetchExams();
  }, [location.pathname]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllExams();
      setExams(response.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived values
  const totalExams = exams.length;
  const activeExams = exams.filter((e) => e.isActive === true).length;
  const recentExams = exams.slice(0, 5);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "100px" }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="card-title">Admin Dashboard</h1>
      <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>
        Welcome back, {user?.fullName || "Admin"}!
      </p>

      {/* ===== STATS ===== */}
      <div className="grid grid-3 mb-20">

        {/* TOTAL EXAMS */}
        <Link to="/admin/exams" style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <h3>Total Exams</h3>
            <p style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
              {totalExams}
            </p>
          </div>
        </Link>

        {/* ACTIVE EXAMS */}
        <Link to="/admin/exams?active=true" style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <h3>Active Exams</h3>
            <p style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
              {activeExams}
            </p>
          </div>
        </Link>

        {/*  ANALYTICS CARD */}
        <div
          className="card"
          onClick={() => navigate("/admin/analytics")}
          style={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            color: "white",
            cursor: "pointer",
          }}
        >
          <h3>Analytics</h3>
          <p style={{ marginTop: "10px" }}>
            View performance, pass/fail stats, top students & exam analytics
          </p>
        </div>
      </div>

      {/* ===== QUICK ACTION ROW ===== */}
      <div className="card mb-20">
        <h3>Quick Actions</h3>

        <Link
          to="/admin/create-exam"
          className="btn btn-primary"
          style={{ marginTop: "10px" }}
        >
          Create New Exam
        </Link>
      </div>

      {/* ===== RECENT EXAMS ===== */}
      <div className="card">
        <div className="flex justify-between align-center mb-20">
          <h2 className="card-title" style={{ marginBottom: 0 }}>
            Recent Exams
          </h2>
          <Link to="/admin/exams" className="btn btn-primary">
            View All Exams
          </Link>
        </div>

        {recentExams.length === 0 ? (
          <p>No exams created yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.durationMinutes} min</td>
                  <td>{exam.totalMarks}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: exam.isActive ? "#d4edda" : "#f8d7da",
                        color: exam.isActive ? "#155724" : "#721c24",
                      }}
                    >
                      {exam.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/exam/${exam.id}`}
                      className="btn btn-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
