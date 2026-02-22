import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ===== Hide navbar on login / register =====
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return null;
  if (!user) return null;

  // ===== Logout (NO reload, NO crash) =====
  const handleLogout = () => {
    logout();              // clear token + user
    navigate("/login", { replace: true }); // smooth redirect (SPA)
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">

        {/* ===== BRAND ===== */}
        <Link
          to={isAdmin() ? "/admin/dashboard" : "/student/dashboard"}
          className="navbar-brand"
        >
          Online Exam System
        </Link>

        {/* ===== MENU ===== */}
        <div className="navbar-menu">

          {/* USER INFO */}
          <span style={{ color: "white", marginRight: "15px" }}>
            Welcome, {user.fullName} ({user.role})
          </span>

          {/* ===== ADMIN LINKS ===== */}
          {isAdmin() && (
            <>
              <Link to="/admin/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <Link to="/admin/exams" className="navbar-link">
                Manage Exams
              </Link>

              <Link to="/admin/create-exam" className="navbar-link">
                Create Exam
              </Link>
            </>
          )}

          {/* ===== STUDENT LINKS ===== */}
          {isStudent() && (
            <>
              <Link to="/student/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <Link to="/student/exams" className="navbar-link">
                Available Exams
              </Link>

              <Link to="/student/my-results" className="navbar-link">
                My Results
              </Link>
            </>
          )}

          {/* ===== LOGOUT ===== */}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
