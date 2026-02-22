import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Auto login on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ================= LOGOUT (NO PAGE RELOAD) =================
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    
  };

  // ================= ROLE HELPERS =================
  const isAdmin = () => user && user.role === "ADMIN";
  const isStudent = () => user && user.role === "STUDENT";

  const value = {
    user,
    token,
    login,
    logout,
    isAdmin,
    isStudent,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ================= HOOK =================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
