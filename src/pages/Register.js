import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authAPI.register(formData);
      setSuccess("🎉 Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Background Overlay */}
      <div style={styles.overlay}></div>

      {/* Floating Particles */}
      <div style={styles.particles}></div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.systemTitle}>Online Secure Exam System</h1>
        <p style={styles.systemSubtitle}>Create your account to continue</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
"url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=60')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.65)",
    zIndex: 0,
  },

  particles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage:
      "radial-gradient(white 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.15,
    animation: "moveParticles 20s linear infinite",
    zIndex: 0,
  },

  header: {
    color: "white",
    textAlign: "center",
    marginBottom: "20px",
    zIndex: 1,
  },

  systemTitle: {
    fontSize: "28px",
    fontWeight: "700",
  },

  systemSubtitle: {
    fontSize: "14px",
    opacity: 0.8,
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    padding: "28px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
  },

  button: {
    width: "100%",
    padding: "11px",
    borderRadius: "6px",
    border: "none",
    background: "#00c853",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    marginTop: "12px",
  },

  link: {
    color: "#ffd369",
    textDecoration: "none",
  },

  error: {
    background: "#ff4d4d",
    padding: "6px",
    borderRadius: "5px",
    marginBottom: "10px",
  },

  success: {
    background: "#00c853",
    padding: "6px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};
