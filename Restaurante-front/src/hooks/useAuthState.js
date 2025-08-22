import { useState, useEffect } from "react";

export const useAuthState = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const updateAuthState = () => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    const isAuth =
      localStorage.getItem("isAuthenticated") === "true" ||
      sessionStorage.getItem("isAuthenticated") === "true";

    setAuthState({
      user: user ? JSON.parse(user) : null,
      isAuthenticated: isAuth,
      loading: false,
    });
  };

  useEffect(() => {
    updateAuthState();

    const handleAuthChange = () => updateAuthState();
    const handleStorageChange = (e) => {
      if (
        e.key === "user" ||
        e.key === "isAuthenticated" ||
        e.key === "token"
      ) {
        updateAuthState();
      }
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("userLoggedIn", handleAuthChange);
    window.addEventListener("userLoggedOut", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("userLoggedIn", handleAuthChange);
      window.removeEventListener("userLoggedOut", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return authState;
};
