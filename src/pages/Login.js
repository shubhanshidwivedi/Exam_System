import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  //  AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/student/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, id, username, email, fullName, role } = response.data;

      login({ id, username, email, fullName, role }, token);

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.particles}></div>

      <div style={styles.header}>
        <h1 style={styles.systemTitle}>Online Secure Exam System</h1>
        <p style={styles.systemSubtitle}>Login to continue</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')",
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
    backgroundImage: "radial-gradient(white 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.15,
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
    width: "340px",
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
};
