import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

/* =====================================================
   ================= GLOBAL ANALYTICS ===================
   ===================================================== */

// GLOBAL OVERALL METRICS
export const getOverall = async () => {
  const res = await api.get("/admin/analytics/overall");
  return res.data || {};
};

// GLOBAL PASS / FAIL
export const getPassFail = async () => {
  const res = await api.get("/admin/analytics/pass-fail");
  return res.data || { pass: 0, fail: 0 };
};

// GLOBAL TOP STUDENTS
export const getTopStudents = async () => {
  const res = await api.get("/admin/analytics/top-students");
  return res.data || [];
};

// GLOBAL SCORE DISTRIBUTION
export const getScoreDistribution = async () => {
  const res = await api.get("/admin/analytics/score-distribution");
  return res.data || {};
};

// EXAM-WISE PASS FAIL (Bar Chart)
export const getExamWisePassFail = async () => {
  const res = await api.get("/admin/analytics/pass-fail-exam-wise");
  return res.data || [];
};

/* =====================================================
   ============== OPTIONAL PER-EXAM ANALYTICS ==========
   ===================================================== */

// Use only when admin selects exam from dropdown (optional)

export const getExamOverall = async (examId) => {
  const res = await api.get(`/admin/analytics/overall/${examId}`);
  return res.data || {};
};

export const getExamPassFail = async (examId) => {
  const res = await api.get(`/admin/analytics/pass-fail/${examId}`);
  return res.data || { pass: 0, fail: 0 };
};

export const getExamTopStudents = async (examId) => {
  const res = await api.get(`/admin/analytics/top-students/${examId}`);
  return res.data || [];
};

export const getExamScoreDistribution = async (examId) => {
  const res = await api.get(`/admin/analytics/score-distribution/${examId}`);
  return res.data || {};
};

// STUDENT LIST BY EXAM (Drill-down table)

export const getStudentsByExam = async (examId) => {
  const res = await fetch(`http://localhost:8080/api/analytics/students/exam/${examId}`);
  return res.json();
};

