import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/StudentDashboard";
import StudentExams from "./pages/StudentExams";
import StudentResults from "./pages/StudentResults";
import TakeExam from "./pages/TakeExam";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminExams from "./pages/AdminExams";
import CreateExam from "./pages/CreateExam";
import AdminExamDetails from "./pages/AdminExamDetails";
import EditExam from "./pages/EditExam";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ExamStudentsPage from "./pages/ExamStudentsPage";

/* =====================================================
   ROLE BASED DEFAULT REDIRECT COMPONENT
===================================================== */
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/student/dashboard" />;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: "100vh" }}>
          <Navbar />

          <Routes>

            {/* ================= AUTH (GUEST ONLY) ================= */}
            <Route
              path="/login"
              element={token ? <RoleBasedRedirect /> : <Login />}
            />

            <Route
              path="/register"
              element={token ? <RoleBasedRedirect /> : <Register />}
            />

            {/* ================= STUDENT ================= */}

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/exams"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentExams />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/exam/:examId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <TakeExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/my-results"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentResults />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ================= */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminExams />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/create-exam"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CreateExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/exam/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminExamDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit-exam/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <EditExam />
                </ProtectedRoute>
              }
            />

            {/* ================= ANALYTICS ================= */}

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />

            {/* ================= DRILL-DOWN ================= */}

            <Route
              path="/admin/exam-students/:examId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ExamStudentsPage />
                </ProtectedRoute>
              }
            />

            {/* ================= DEFAULT ================= */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/*  IMPORTANT — CATCH ALL (Fix refresh + unknown path) */}
            <Route path="*" element={<RoleBasedRedirect />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
