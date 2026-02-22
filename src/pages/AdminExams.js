import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminAPI } from "../services/api";

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FILE IMPORT STATES
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const activeOnly = query.get("active");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await adminAPI.getAllExams();
      setExams(res.data || []);
    } catch (err) {
      console.error("Fetch Exams Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = activeOnly
    ? exams.filter((e) => e.isActive === true)
    : exams;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this exam?");
    if (!confirmDelete) return;

    try {
      await adminAPI.deleteExam(id);
      fetchExams();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete exam");
    }
  };

  const toggleActive = async (exam) => {
    try {
      await adminAPI.updateExam(exam.id, {
        title: exam.title,
        description: exam.description || "",
        durationMinutes: exam.durationMinutes,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        startTime: exam.startTime || null,
        endTime: exam.endTime || null,
        isActive: !exam.isActive,
      });
      fetchExams();
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("Failed to update status");
    }
  };

  // HANDLE FILE SELECT
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //  IMPORT EXAM FROM FILE
  const handleImportExam = async () => {
    if (!file) {
      alert("Please select a PDF/DOCX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setImporting(true);

      const res = await adminAPI.importExam(formData);

      alert(res.data || "Exam imported successfully");
      setFile(null);
      fetchExams(); // refresh list
    } catch (err) {
      console.error("Import Error:", err);
      alert(err.response?.data || "Failed to import exam");
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading Exams...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="card-title">Manage Exams</h1>


      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/create-exam" className="btn btn-primary">
          Create New Exam
        </Link>{" "}
        <Link to="/admin/exams?active=true" className="btn btn-secondary">
          Active Only
        </Link>{" "}
        <Link to="/admin/exams" className="btn btn-secondary">
          All Exams
        </Link>
      </div>

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
          {filteredExams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.title}</td>
              <td>{exam.durationMinutes} min</td>
              <td>{exam.totalMarks}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={exam.isActive}
                      onChange={() => toggleActive(exam)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontWeight: "600",
                      fontSize: "12px",
                      color: "white",
                      background: exam.isActive ? "#28a745" : "#6c757d",
                    }}
                  >
                    {exam.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </td>
              <td>
                <Link to={`/admin/edit-exam/${exam.id}`} className="btn btn-sm btn-primary">
                  Edit
                </Link>{" "}
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredExams.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No exams found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminExams;
