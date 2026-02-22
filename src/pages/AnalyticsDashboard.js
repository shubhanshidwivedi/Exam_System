import React, { useEffect, useState } from "react";

import OverallMetricsCards from "../components/OverallMetricsCards";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import PassFailPie from "../components/PassFailPie";
import ExamWiseBar from "../components/ExamWiseBar";


import {
  getPassFail,
  getTopStudents,
  getOverall,
  getScoreDistribution,
  getExamWisePassFail,
  getStudentsByExam
} from "../services/analyticsService";

const AnalyticsDashboard = () => {

  const [passFail, setPassFail] = useState({ pass: 0, fail: 0 });
  const [topStudents, setTopStudents] = useState([]);
  const [overall, setOverall] = useState({});
  const [scoreDist, setScoreDist] = useState({});
  const [examPassFail, setExamPassFail] = useState([]);

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPassFail(await getPassFail());
      setTopStudents(await getTopStudents());
      setOverall(await getOverall());
      setScoreDist(await getScoreDistribution());
      setExamPassFail(await getExamWisePassFail());
    } catch (err) {
      console.error(err);
    }
  };

  const handleExamBarClick = async (examId) => {
  console.log("Clicked exam:", examId);

  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/api/admin/analytics/students-by-exam/${examId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("API failed");
      return res.json();
    })
    .then(data => {
      console.log("Students:", data);
      setStudents(data);
    })
    .catch(err => {
      console.error("Failed to load students", err);
      alert("Failed to load student attempts");
    });
};


  // ================= BAR CLICK =================
  const handleBarClick = async (examId) => {
    try {
      const res = await getStudentsByExam(examId);
      setStudents(res || []);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 30, background: "#f4f6f9", minHeight: "100vh" }}>
      <h1>📊 Analytics Dashboard</h1>

      <OverallMetricsCards data={overall} />

      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <div style={card}>
          <PassFailPie passFail={passFail} />
        </div>

        <div style={{ ...card, flex: 2 }}>
          <ExamWiseBar
  data={examPassFail}
  onBarClick={handleExamBarClick}
/>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 25, flexWrap: "wrap" }}>
        <div style={card}>
          <h3>Score Distribution</h3>
          <ScoreDistributionChart data={scoreDist} />
        </div>

        <div style={card}>
          <h3>🏆 Top Students</h3>

          <table style={table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((s, i) => (
                <tr key={i}>
                  <td>{s.studentName}</td>
                  <td>{s.examName}</td>
                  <td>{s.score}</td>
                  <td style={{ color: s.status === "PASS" ? "#4caf50" : "#f44336" }}>
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={modalBg}>
          <div style={modalStyle }>
            <h3>📋 Students Attempt Details</h3>

            <table style={table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.studentName}</td>
                    <td>{s.score}</td>
                    <td style={{ color: s.passed ? "#4caf50" : "#f44336" }}>
                      {s.passed ? "PASS" : "FAIL"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={() => setShowModal(false)} style={closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= STUDENTS MODAL ================= */}
{showModal && (
  <div style={overlay}>
    <div style={modal}>

      <h3>Students Attempt Details</h3>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>Name</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} style={{ textAlign: "center" }}>
                <td>{s.studentName}</td>
                <td>{s.score}</td>
                <td
                  style={{
                    color: s.passed ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {s.passed ? "PASS" : "FAIL"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: 15,
          padding: "8px 15px",
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Close
      </button>

    </div>
  </div>
)}


    </div>
  );
};

const card = {
  flex: 1,
  minWidth: 350,
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const modalBg = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 12,
  width: "500px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
};

const closeBtn = {
  marginTop: 15,
  padding: "8px 16px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle  = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  minWidth: 400,
  maxHeight: "70vh",
  overflowY: "auto",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};


export default AnalyticsDashboard;
