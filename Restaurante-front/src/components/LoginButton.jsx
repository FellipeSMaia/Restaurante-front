import React, { useEffect, useRef, useCallback } from "react";
import authService from "../services/authService";

const LoginButton = ({
  className = "",
  children = "Login",
  loginPath = "/login",
  style = {},
  popupOptions = {},
  onLoginSuccess = () => {},
  onLoginError = () => {},
  trustedOrigins = [],
}) => {
  const popupRef = useRef(null);
  const intervalRef = useRef(null);

  const logError = useCallback((...args) => {
    console.error(...args);
  }, []);

  const calculatePopupPosition = useCallback(
    (width, height) => {
      try {
        const screenWidth = window.screen?.width || window.innerWidth || 1024;
        const screenHeight = window.screen?.height || window.innerHeight || 768;

        return {
          left: Math.max(0, Math.floor(screenWidth / 2 - width / 2)),
          top: Math.max(0, Math.floor(screenHeight / 2 - height / 2)),
        };
      } catch (error) {
        logError("Erro ao calcular posição do popup:", error);
        return { left: 100, top: 100 };
      }
    },
    [logError]
  );

  const getPopupOptions = useCallback(() => {
    const width = popupOptions.width || 400;
    const height = popupOptions.height || 600;
    const position = calculatePopupPosition(width, height);

    return {
      width,
      height,
      left: position.left,
      top: position.top,
      resizable: "yes",
      scrollbars: "yes",
      toolbar: "no",
      menubar: "no",
      location: "no",
      directories: "no",
      status: "no",
      ...popupOptions,
    };
  }, [popupOptions, calculatePopupPosition]);

  const saveToStorage = useCallback(
    (data) => {
      try {
        const { user, token, rememberMe } = data;

        if (!token) throw new Error("Token não fornecido");

        const currentToken = authService.getToken();
        const currentUser = authService.getUser();
        const currentAuth = authService.isAuthenticated();

        if (currentToken === token && currentUser && currentAuth) {
          return true;
        }

        authService.clearUserData();
        authService.setUser(user, rememberMe || false);
        authService.setToken(token, rememberMe || false);
        authService.setAdditionalData(user?.email || "", rememberMe || false);

        return true;
      } catch (error) {
        logError("Erro ao salvar via authService:", error);
        return false;
      }
    },
    [logError]
  );

  const dispatchLoginEvents = useCallback(
    (data) => {
      try {
        const events = [
          {
            name: "userLoggedIn",
            detail: { user: data.user, token: data.token },
          },
          {
            name: "loginStateChanged",
            detail: {
              isAuthenticated: true,
              user: data.user,
              token: data.token,
            },
          },
        ];

        events.forEach(({ name, detail }) => {
          window.dispatchEvent(new CustomEvent(name, { detail }));
        });
      } catch (error) {
        logError("Erro ao disparar eventos:", error);
      }
    },
    [logError]
  );

  const isValidOrigin = useCallback(
    (origin) =>
      trustedOrigins.length === 0
        ? origin === window.location.origin
        : trustedOrigins.includes(origin),
    [trustedOrigins]
  );

  const handleMessage = useCallback(
    (event) => {
      if (!isValidOrigin(event.origin)) {
        logError("Origem não confiável:", event.origin);
        return;
      }

      if (!event.data || typeof event.data !== "object") {
        logError("Dados da mensagem inválidos");
        return;
      }

      const { type, user, token, rememberMe } = event.data;

      if (type === "LOGIN_SUCCESS") {
        if (!token) {
          const error = new Error("Token não fornecido pelo servidor");
          logError(error.message);
          onLoginError({ error: error.message });
          return;
        }

        const loginData = { user, token, rememberMe: Boolean(rememberMe) };

        const saved = saveToStorage(loginData);
        if (!saved) {
          onLoginError({ error: "Erro ao salvar dados de autenticação" });
          return;
        }

        dispatchLoginEvents(loginData);

        if (popupRef.current) {
          try {
            popupRef.current.close();
          } catch (error) {
            logError("Erro ao fechar popup:", error);
          }
          popupRef.current = null;
        }

        onLoginSuccess(loginData);
      } else if (type === "LOGIN_ERROR") {
        logError("Erro no login:", event.data);
        onLoginError(event.data);
      }
    },
    [
      isValidOrigin,
      saveToStorage,
      dispatchLoginEvents,
      onLoginSuccess,
      onLoginError,
      logError,
    ]
  );

  const monitorPopup = useCallback(() => {
    if (!popupRef.current) return;

    intervalRef.current = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        popupRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000);
  }, []);

  const clearPopupMonitor = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    return () => {
      clearPopupMonitor();
      if (popupRef.current && !popupRef.current.closed) {
        try {
          popupRef.current.close();
        } catch (error) {
          logError("Erro ao fechar popup no cleanup:", error);
        }
      }
    };
  }, [clearPopupMonitor, logError]);

  const handleLoginClick = useCallback(
    (e) => {
      e.preventDefault();

      if (popupRef.current && !popupRef.current.closed) {
        try {
          popupRef.current.close();
        } catch (error) {
          logError("Erro ao fechar popup anterior:", error);
        }
      }

      clearPopupMonitor();

      try {
        const options = getPopupOptions();
        const optionsString = Object.entries(options)
          .map(([key, value]) => `${key}=${value}`)
          .join(",");
        const popup = window.open(loginPath, "loginPopup", optionsString);

        if (popup) {
          popupRef.current = popup;
          popup.focus();
          monitorPopup();
        } else {
          throw new Error("Popup bloqueado ou não suportado");
        }
      } catch (error) {
        logError("Erro ao abrir popup:", error);
        if (
          confirm(
            "Não foi possível abrir o popup. Deseja abrir em uma nova aba?"
          )
        ) {
          window.open(loginPath, "_blank");
        } else {
          window.location.href = loginPath;
        }
      }
    },
    [loginPath, getPopupOptions, clearPopupMonitor, monitorPopup, logError]
  );

  return (
    <button
      onClick={handleLoginClick}
      className={className}
      style={style}
      type="button"
      aria-label="Fazer login"
    >
      {children}
    </button>
  );
};

export default LoginButton;
