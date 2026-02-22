import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // ===== While restoring session =====
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  // ===== Not logged in =====
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ===== Role mismatch =====
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
