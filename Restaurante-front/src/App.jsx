import React, { createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Container from "./components/container/Container";
import Footer from "./components/footer/Footer";

import { FooterProvider, useFooter } from "./contexts/FooterContext";
import authService from "./services/authService";

export const AuthContext = createContext();

function AppContent() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showFooter } = useFooter();

  useEffect(() => {
    initializeAuth();

    const handleUserLoggedIn = (event) => {
      const { user: userData, token } = event.detail || {};
      if (userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(authService.isAdmin());
      } else {
        updateAuthState();
      }
    };

    const handleUserLoggedOut = () => {
      clearAuthData();
    };

    const handleGlobalLogout = () => {
      clearAuthData();
      navigate("/login", { replace: true });
    };

    const handleStorageChange = (e) => {
      if (
        e.key === "user" ||
        e.key === "token" ||
        e.key === "authToken" ||
        e.key === "isAuthenticated"
      ) {
        updateAuthState();
      }
    };

    const handlePopupMessage = (event) => {
      if (event.data?.type === "LOGIN_SUCCESS") {
        
        setTimeout(() => {
          updateAuthState();
        }, 100);
      }
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);
    window.addEventListener("auth:logout", handleGlobalLogout);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("message", handlePopupMessage);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
      window.removeEventListener("auth:logout", handleGlobalLogout);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("message", handlePopupMessage);
    };
  }, [navigate]);

  const updateAuthState = () => {
    try {
      const userData = authService.getUser();
      const token = authService.getToken();
      const isAuth = authService.isAuthenticated();

      if (isAuth && userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(authService.isAdmin());
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Erro em updateAuthState:", error);
      clearAuthData();
    }
  };

  const initializeAuth = async () => {
    try {
      const hasValidSession = authService.init();
      if (hasValidSession) {
        const userData = authService.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(authService.isAdmin());
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Erro na inicialização:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const handleLogin = (userData, token, remember = false) => {
    try {
      authService.clearUserData();

      authService.setUser(userData, remember);
      authService.setToken(token, remember);
      authService.setAdditionalData(userData.email, remember);

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(authService.isAdmin());

      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: userData, token },
        })
      );

      return true;
    } catch (error) {
      console.error("Erro no handleLogin:", error);
      return false;
    }
  };

  const handleLogout = () => {
    try {
      authService.logout();
      clearAuthData();
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      }, 50);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro no handleLogout:", error);
      clearAuthData();
      navigate("/", { replace: true });
    }
  };

  const refreshUser = async () => {
    if (!isAuthenticated) throw new Error("Usuário não autenticado");

    try {
      const userData = await authService.refreshUser();
      setUser(userData);
      setIsAdmin(authService.isAdmin());

      window.dispatchEvent(
        new CustomEvent("userUpdated", {
          detail: { user: userData },
        })
      );

      return userData;
    } catch (error) {
      if (
        error.message.includes("Sessão expirada") ||
        error.message.includes("não autenticado")
      ) {
        handleLogout();
      }
      throw error;
    }
  };

  const validateSession = async () => {
    try {
      const isValid = await authService.validateToken();
      if (!isValid && isAuthenticated) {
        handleLogout();
      }
      return isValid;
    } catch {
      if (isAuthenticated) {
        handleLogout();
      }
      return false;
    }
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  const getUserName = () => {
    return user?.nome || user?.name || user?.email || "Usuário";
  };

  const getUserRole = () => {
    if (isAdmin) return "admin";
    return user?.role || user?.tipo || "user";
  };

  const getAuthState = () => {
    return {
      ...authService.getAuthState(),
      contextUser: user,
      contextIsAuthenticated: isAuthenticated,
      contextIsAdmin: isAdmin,
    };
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#d3d3d3] flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login: handleLogin,
        logout: handleLogout,
        refreshUser,
        validateSession,
        getUserName,
        getUserRole,
        hasPermission,
        getAuthState,
        updateAuthState,
        loading,
      }}
    >
      <div className="h-screen w-screen bg-[#d3d3d3] flex flex-col overflow-hidden">
        <Header>
          <Navbar />
        </Header>

        <Container className="flex-1 min-h-0">
          <Outlet />
        </Container>

        {showFooter && <Footer />}
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <FooterProvider>
      <AppContent />
    </FooterProvider>
  );
}

export default App;
