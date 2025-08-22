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

  setToken(token, remember = false) {
    try {
      this.clearTokens();
      if (token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", token);
        storage.setItem("authToken", token);
      }
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  },

  setUser(user, remember = false) {
    try {
      this.clearUserFromBothStorages();
      if (user) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  },

  setAdditionalData(email, remember = false) {
    try {
      const storage = remember ? localStorage : sessionStorage;
      const oppositeStorage = remember ? sessionStorage : localStorage;

      oppositeStorage.removeItem("userEmail");
      oppositeStorage.removeItem("isAuthenticated");
      oppositeStorage.removeItem("loginTimestamp");

      storage.setItem("userEmail", email);
      storage.setItem("isAuthenticated", "true");
      storage.setItem("loginTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Erro ao salvar dados adicionais:", error);
    }
  },

  clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
  },

  clearUserFromBothStorages() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },

  getToken() {
    try {
      let token =
        sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
      if (!token) {
        token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
      }
      return token;
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      return null;
    }
  },

  getUser() {
    try {
      const userStr =
        sessionStorage.getItem("user") || localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error);
      this.clearUserData();
      return null;
    }
  },

  clearUserData() {
    try {
      const itemsToRemove = [
        "user",
        "token",
        "authToken",
        "refreshToken",
        "isAuthenticated",
        "userEmail",
        "loginTimestamp",
      ];
      itemsToRemove.forEach((item) => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
    }
  },

  isAuthenticated() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      let isAuthFlag =
        sessionStorage.getItem("isAuthenticated") ||
        localStorage.getItem("isAuthenticated");
      return !!(token && user && user.id && isAuthFlag === "true");
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
      this.setUser(userData, remember);
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
      let isAuth =
        sessionStorage.getItem("isAuthenticated") ||
        localStorage.getItem("isAuthenticated");

      if (token && user && user.id && isAuth === "true") {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
      }

      if (token || user || isAuth) {
        this.logout();
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
      const hasDataInLocal = !!(
        (localStorage.getItem("token") || localStorage.getItem("authToken")) &&
        localStorage.getItem("user")
      );
      const hasDataInSession = !!(
        (sessionStorage.getItem("token") ||
          sessionStorage.getItem("authToken")) &&
        sessionStorage.getItem("user")
      );
      return hasDataInLocal && !hasDataInSession;
    } catch (error) {
      console.error("Erro ao verificar sessão persistente:", error);
      return false;
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
        userData: this.getUser(),
      };
    } catch (error) {
      console.error("Erro ao obter estado de autenticação:", error);
      return {
        token: false,
        user: false,
        isAuthenticated: false,
        isAdmin: false,
        isPersistent: false,
        userData: null,
      };
    }
  },
};

export default authService;
