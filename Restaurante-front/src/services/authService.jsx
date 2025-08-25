import api from "./api";

const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/login", { email, senha: password });
      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/usuarios", userData);
      return response.data;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  },

  saveSession(token, user, email, remember = false) {
    try {
      if (typeof Storage === "undefined") {
        throw new Error("Storage não suportado pelo navegador");
      }

      this._clearAllDataSilent();

      if (!token || !user) {
        throw new Error("Token e usuário são obrigatórios");
      }

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("authToken", token);
      storage.setItem("user", JSON.stringify(user));
      storage.setItem("userEmail", email);
      storage.setItem("isAuthenticated", "true");
      storage.setItem("loginTimestamp", Date.now().toString());

      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }

      const savedToken = storage.getItem("token");
      const savedUser = storage.getItem("user");
      if (!savedToken || !savedUser) {
        throw new Error("Falha ao salvar dados da sessão");
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      this._clearAllDataSilent();
      throw error;
    }
  },

  setToken(token, remember = false) {
    try {
      if (typeof Storage === "undefined") {
        throw new Error("Storage não suportado pelo navegador");
      }

      if (token) {
        if (remember) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        if (remember) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("authToken");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
        }

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", token);
        storage.setItem("authToken", token);
      }
    } catch (error) {
      console.error("Erro ao salvar token:", error);
      throw error;
    }
  },

  setUser(user, remember = false) {
    try {
      if (typeof Storage === "undefined") {
        throw new Error("Storage não suportado pelo navegador");
      }

      if (user) {
        if (remember) {
          localStorage.setItem("rememberMe", "true");
        }

        if (remember) {
          sessionStorage.removeItem("user");
        } else {
          localStorage.removeItem("user");
        }

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
    }
  },

  setAdditionalData(email, remember = false) {
    try {
      if (typeof Storage === "undefined") {
        throw new Error("Storage não suportado pelo navegador");
      }

      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }

      if (remember) {
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("loginTimestamp");
      } else {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loginTimestamp");
      }

      const storage = remember ? localStorage : sessionStorage;
      const timestamp = Date.now().toString();

      storage.setItem("userEmail", email);
      storage.setItem("isAuthenticated", "true");
      storage.setItem("loginTimestamp", timestamp);
    } catch (error) {
      console.error("Erro ao salvar dados adicionais:", error);
      throw error;
    }
  },

  _clearAllDataSilent() {
    try {
      const itemsToRemove = [
        "user",
        "token",
        "authToken",
        "refreshToken",
        "isAuthenticated",
        "userEmail",
        "loginTimestamp",
        "rememberMe",
      ];

      itemsToRemove.forEach((item) => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
    }
  },

  _clearAllTokensSilent() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
    } catch (error) {
      console.error("Erro ao limpar tokens:", error);
    }
  },

  _clearAllUsersSilent() {
    try {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } catch (error) {
      console.error("Erro ao limpar usuário:", error);
    }
  },

  _clearAllAdditionalDataSilent() {
    try {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("loginTimestamp");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("loginTimestamp");
    } catch (error) {
      console.error("Erro ao limpar dados adicionais:", error);
    }
  },

  getToken() {
    try {
      const wasRememberMeSession =
        localStorage.getItem("rememberMe") === "true";

      const localToken =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const localUser = localStorage.getItem("user");
      const localAuth = localStorage.getItem("isAuthenticated");

      const sessionToken =
        sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
      const sessionUser = sessionStorage.getItem("user");
      const sessionAuth = sessionStorage.getItem("isAuthenticated");

      if (wasRememberMeSession) {
        const hasValidLocalData =
          localToken && localUser && localAuth === "true";

        if (hasValidLocalData) {
          if (sessionToken || sessionUser || sessionAuth) {
            this._clearSessionDataSilent();
          }
          return localToken;
        } else {
          this._clearAllDataSilent();
          return null;
        }
      }

      const hasValidSessionData =
        sessionToken && sessionUser && sessionAuth === "true";

      if (hasValidSessionData) {
        const hasValidLocalRememberMe =
          localToken &&
          localUser &&
          localAuth === "true" &&
          wasRememberMeSession;

        if (
          !hasValidLocalRememberMe &&
          (localToken || localUser || localAuth)
        ) {
          this._clearLocalDataSilent();
        }

        return sessionToken;
      }

      const hasValidLocalData = localToken && localUser && localAuth === "true";

      if (hasValidLocalData) {
        return localToken;
      }

      const hasAnyData =
        localToken ||
        localUser ||
        localAuth ||
        sessionToken ||
        sessionUser ||
        sessionAuth;
      if (hasAnyData) {
        this._clearAllDataSilent();
      }

      return null;
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      this._clearAllDataSilent();
      return null;
    }
  },

  _clearSessionDataSilent() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("loginTimestamp");
  },

  _clearLocalDataSilent() {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTimestamp");
  },

  getUser() {
    try {
      const wasRememberMeSession =
        localStorage.getItem("rememberMe") === "true";

      const localToken =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const localUserStr = localStorage.getItem("user");
      const localAuth = localStorage.getItem("isAuthenticated");

      const sessionToken =
        sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
      const sessionUserStr = sessionStorage.getItem("user");
      const sessionAuth = sessionStorage.getItem("isAuthenticated");

      if (wasRememberMeSession) {
        const hasValidLocalData =
          localToken && localUserStr && localAuth === "true";

        if (hasValidLocalData) {
          if (sessionToken || sessionUserStr || sessionAuth) {
            this._clearSessionDataSilent();
          }
          return JSON.parse(localUserStr);
        } else {
          this._clearAllDataSilent();
          return null;
        }
      }

      const hasValidSessionData =
        sessionToken && sessionUserStr && sessionAuth === "true";

      if (hasValidSessionData) {
        const hasValidLocalRememberMe =
          localToken &&
          localUserStr &&
          localAuth === "true" &&
          wasRememberMeSession;

        if (
          !hasValidLocalRememberMe &&
          (localToken || localUserStr || localAuth)
        ) {
          this._clearLocalDataSilent();
        }

        return JSON.parse(sessionUserStr);
      }

      const hasValidLocalData =
        localToken && localUserStr && localAuth === "true";

      if (hasValidLocalData) {
        return JSON.parse(localUserStr);
      }

      const hasAnyData =
        localToken ||
        localUserStr ||
        localAuth ||
        sessionToken ||
        sessionUserStr ||
        sessionAuth;
      if (hasAnyData) {
        this._clearAllDataSilent();
      }

      return null;
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error);
      this.clearUserData();
      return null;
    }
  },

  clearUserData() {
    try {
      this._clearAllDataSilent();
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
    }
  },

  isAuthenticated() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      return !!(token && user && user.id);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return false;
    }
  },

  isAdmin() {
    try {
      const user = this.getUser();
      if (!user) return false;
      return (
        user.isAdmin === true ||
        user.isAdmin === 1 ||
        user.admin === true ||
        user.role === "admin" ||
        user.tipo === "admin"
      );
    } catch (error) {
      console.error("Erro ao verificar privilégios de admin:", error);
      return false;
    }
  },

  isAuthenticatedAdmin() {
    return this.isAuthenticated() && this.isAdmin();
  },

  async getCurrentUser() {
    try {
      const user = this.getUser();
      const token = this.getToken();
      if (!user || !token) throw new Error("Usuário não autenticado");
      if (!user.id) throw new Error("Dados do usuário inconsistentes - sem ID");
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      throw error;
    }
  },

  async refreshUser() {
    try {
      const userData = await this.getCurrentUser();
      const remember = this.isPersistentSession();
      const email =
        this.getUser()?.email ||
        localStorage.getItem("userEmail") ||
        sessionStorage.getItem("userEmail");
      const token = this.getToken();

      this.saveSession(token, userData, email, remember);
      return userData;
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  },

  hasPermission(permission) {
    try {
      const user = this.getUser();
      if (!user) return false;
      if (this.isAdmin()) return true;
      if (user.permissions && Array.isArray(user.permissions))
        return user.permissions.includes(permission);
      if (user.roles && Array.isArray(user.roles))
        return user.roles.includes(permission);
      return false;
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return false;
    }
  },

  logout() {
    try {
      this.clearUserData();
      if (api.defaults.headers.common["Authorization"]) {
        delete api.defaults.headers.common["Authorization"];
      }
      window.dispatchEvent(new CustomEvent("userLoggedOut"));
    } catch (error) {
      console.error("Erro durante logout:", error);
    }
  },

  init() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      const isAuth = this.isAuthenticated();

      if (token && user && user.id && isAuth) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro na inicialização:", error);
      this.logout();
      return false;
    }
  },

  async validateToken() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      if (!token || !user || !user.id) return false;

      const response = await api.get("/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.valid === true;
    } catch (error) {
      console.error("Erro na validação do token:", error);
      return false;
    }
  },

  isPersistentSession() {
    try {
      const wasRememberMeSession =
        localStorage.getItem("rememberMe") === "true";
      const hasValidLocalData = !!(
        localStorage.getItem("token") &&
        localStorage.getItem("user") &&
        localStorage.getItem("isAuthenticated") === "true"
      );

      return wasRememberMeSession && hasValidLocalData;
    } catch (error) {
      console.error("Erro ao verificar sessão persistente:", error);
      return false;
    }
  },

  getStorageInfo() {
    try {
      return {
        localStorage: {
          token: !!localStorage.getItem("token"),
          authToken: !!localStorage.getItem("authToken"),
          user: !!localStorage.getItem("user"),
          isAuthenticated: localStorage.getItem("isAuthenticated"),
          userEmail: localStorage.getItem("userEmail"),
          rememberMe: localStorage.getItem("rememberMe"),
        },
        sessionStorage: {
          token: !!sessionStorage.getItem("token"),
          authToken: !!sessionStorage.getItem("authToken"),
          user: !!sessionStorage.getItem("user"),
          isAuthenticated: sessionStorage.getItem("isAuthenticated"),
          userEmail: sessionStorage.getItem("userEmail"),
        },
      };
    } catch (error) {
      console.error("Erro ao obter info de storage:", error);
      return {};
    }
  },

  getAuthState() {
    try {
      return {
        token: !!this.getToken(),
        user: !!this.getUser(),
        isAuthenticated: this.isAuthenticated(),
        isAdmin: this.isAdmin(),
        isPersistent: this.isPersistentSession(),
        wasRememberMe: localStorage.getItem("rememberMe") === "true",
        userData: this.getUser(),
        storageInfo: this.getStorageInfo(),
      };
    } catch (error) {
      console.error("Erro ao obter estado de autenticação:", error);
      return {
        token: false,
        user: false,
        isAuthenticated: false,
        isAdmin: false,
        isPersistent: false,
        wasRememberMe: false,
        userData: null,
        storageInfo: {},
      };
    }
  },

  clearAllTokens() {
    try {
      this._clearAllTokensSilent();
    } catch (error) {
      console.error("Erro ao limpar tokens:", error);
    }
  },

  clearAllUsers() {
    try {
      this._clearAllUsersSilent();
    } catch (error) {
      console.error("Erro ao limpar usuário:", error);
    }
  },

  clearAllAdditionalData() {
    try {
      this._clearAllAdditionalDataSilent();
    } catch (error) {
      console.error("Erro ao limpar dados adicionais:", error);
    }
  },

  clearTokens() {
    this.clearAllTokens();
  },

  clearUserFromBothStorages() {
    this.clearAllUsers();
  },
};

export default authService;
