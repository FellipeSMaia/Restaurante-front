import React, { useState, useEffect } from "react";
import { User, Settings, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import LoginButton from "./LoginButton";

const AuthButtons = ({
  className = "",
  loginPath = "/login",
  profilePath = "/perfil",
  onLogout = () => {},
  showProfileButton = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthState = () => {
    try {
      const token = authService.getToken();
      const userData = authService.getUser();

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();

    const handleAuthChange = () => {
      checkAuthState();
    };

    const handleStorageChange = (e) => {
      if (
        e.key === "isAuthenticated" ||
        e.key === "user" ||
        e.key === "token"
      ) {
        checkAuthState();
      }
    };

    window.addEventListener("userLoggedIn", handleAuthChange);
    window.addEventListener("userLoggedOut", handleAuthChange);
    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("loginStateChanged", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleAuthChange);
      window.removeEventListener("userLoggedOut", handleAuthChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("loginStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      authService.clearUserData();

      window.dispatchEvent(new CustomEvent("userLoggedOut"));
      window.dispatchEvent(new CustomEvent("authStateChanged"));

      setIsAuthenticated(false);
      setUser(null);

      onLogout();

      console.log("Logout realizado com sucesso");

      navigate("/");
    } catch (error) {
      console.error("Erro durante logout:", error);
    }
  };

  const handleProfileEdit = () => {
    navigate(profilePath);
  };

  const handleLoginSuccess = (data) => {
    console.log("Login realizado via popup");
    checkAuthState();
  };

  const handleLoginError = (error) => {
    console.error("Erro no login via popup:", error);
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showProfileButton && (
          <button
            onClick={handleProfileEdit}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Editar perfil"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Perfil</span>
          </button>
        )}

        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {user.nome || user.email?.split("@")[0] || "Usuário"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <LoginButton
        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
        loginPath={loginPath}
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
        popupOptions={{
          width: 450,
          height: 650,
        }}
      >
        <LogIn className="w-4 h-4" />
        <span className="font-medium">Entrar</span>
      </LoginButton>
    </div>
  );
};

export default AuthButtons;
