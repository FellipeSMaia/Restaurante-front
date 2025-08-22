import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthState = () => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const isAuth =
      localStorage.getItem("isAuthenticated") === "true" ||
      sessionStorage.getItem("isAuthenticated") === "true";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && isAuth) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "user" ||
        e.key === "isAuthenticated" ||
        e.key === "token"
      ) {
        updateAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleUserLogin = (event) => {
      const { user: userData, token } = event.detail;
      login(userData, token);
    };

    const handleUserLogout = () => {
      
      updateAuthState();
    };

    const handleAuthStateChange = () => {
      updateAuthState();
    };

    window.addEventListener("userLoggedIn", handleUserLogin);
    window.addEventListener("userLoggedOut", handleUserLogout);
    window.addEventListener("authStateChanged", handleAuthStateChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
      window.removeEventListener("userLoggedOut", handleUserLogout);
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
    if (token) {
      localStorage.setItem("token", token);
    }

    window.dispatchEvent(new CustomEvent("authStateChanged"));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTimestamp");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("loginTimestamp");

    delete api.defaults.headers.common["Authorization"];

    window.dispatchEvent(new CustomEvent("userLoggedOut"));
    window.dispatchEvent(new CustomEvent("authStateChanged"));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
