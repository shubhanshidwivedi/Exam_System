import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

// ================= ADMIN APIs =================
export const adminAPI = {
  createExam: (examData) => api.post("/admin/exams", examData),
  updateExam: (id, examData) => api.put(`/admin/exams/${id}`, examData),
  getAllExams: () => api.get("/admin/exams"),
  getExamById: (id) => api.get(`/admin/exams/${id}`),
  deleteExam: (id) => api.delete(`/admin/exams/${id}`),
  getExamAttempts: (id) => api.get(`/admin/exams/${id}/attempts`),
  getStudentsByExam: (examId) =>
  axios.get(`/api/admin/exam/${examId}/students`),

  //  IMPORT EXAM (PDF / DOCX UPLOAD)
  importQuestions: (formData) =>
  api.post("/admin/import-questions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

// ================= STUDENT APIs =================
export const studentAPI = {
  getAvailableExams: () => api.get("/student/exams"),
  getDashboard: () => api.get("/student/dashboard"),

  startExam: (examId) => api.post(`/student/exams/${examId}/start`),
  submitAnswer: (attemptId, answerData) =>
    api.post(`/student/attempts/${attemptId}/answer`, answerData),
  submitExam: (attemptId) =>
    api.post(`/student/attempts/${attemptId}/submit`),
  getAttempt: (attemptId) => api.get(`/student/attempts/${attemptId}`),
  getMyAttempts: () => api.get("/student/my-attempts"),
};

export default api;
