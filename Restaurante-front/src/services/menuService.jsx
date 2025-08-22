import axios from "axios";
import authService from "./authService";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class MenuService {
  static async getAllItems() {
    try {
      const response = await api.get("/menu");
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "buscar itens");
    }
  }

  static async getItemById(id) {
    try {
      const response = await api.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "buscar item");
    }
  }

  static async createItem(itemData, userId) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Você precisa estar logado para criar itens.");
      }

      if (!userId) {
        throw new Error("ID do usuário é obrigatório para criar itens.");
      }

      const dataWithUserId = {
        ...itemData,
        userId: userId,
      };

      const response = await api.post("/menu", dataWithUserId);
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "criar item");
    }
  }

  static async updateItem(id, itemData, userId) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Você precisa estar logado para atualizar itens.");
      }

      if (!userId) {
        throw new Error("ID do usuário é obrigatório para atualizar itens.");
      }

      if (!id) {
        throw new Error("ID do item é obrigatório para atualização.");
      }

      const dataWithUserId = {
        ...itemData,
        userId: userId,
      };

      const response = await api.put(`/menu/${id}`, dataWithUserId);
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "atualizar item");
    }
  }

  static async deleteItem(id) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Você precisa estar logado para deletar itens.");
      }

      if (!id) {
        throw new Error("ID do item é obrigatório");
      }

      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "deletar item");
    }
  }

  static async toggleAvailability(id, disponivel) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error(
          "Você precisa estar logado para alterar a disponibilidade."
        );
      }

      const response = await api.patch(`/menu/${id}/disponibilidade`, {
        disponivel: Boolean(disponivel),
      });
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "alterar disponibilidade");
    }
  }

  static async getItemsByCategory(categoria) {
    try {
      const response = await api.get(
        `/menu/categoria/${encodeURIComponent(categoria)}`
      );
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "buscar por categoria");
    }
  }

  static async getAvailableItems() {
    try {
      const response = await api.get("/menu/disponiveis/listar");
      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "buscar itens disponíveis");
    }
  }

  static async uploadImage(file) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error(
          "Você precisa estar logado para fazer upload de imagens."
        );
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/menu/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw MenuService.handleError(error, "fazer upload da imagem");
    }
  }

  static async checkServerHealth() {
    try {
      const response = await api.get("/test-uploads", {
        timeout: 5000,
      });
      return { status: "OK", data: response.data };
    } catch (error) {
      return { status: "ERROR", error: error.message };
    }
  }

  static async validateToken() {
    try {
      const token = authService.getToken();

      if (!token) return { valid: false, message: "Token não encontrado" };

      const response = await api.get("/verify-token");
      return { valid: true, data: response.data };
    } catch (error) {
      return {
        valid: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  static handleError(error, action) {
    if (error.response?.status === 401) {
      return new Error("Sessão expirada. Faça login novamente.");
    }

    if (error.response?.status === 403) {
      return new Error(`Você não tem permissão para ${action}.`);
    }

    if (error.response?.status === 404) {
      return new Error("Item não encontrado.");
    }

    if (error.response?.status === 409) {
      return new Error(
        "Conflito: este item está sendo usado em outras operações."
      );
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.message || "Dados inválidos.";
      return new Error(message);
    }

    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.message || "Erro interno do servidor";
      return new Error(`Erro do servidor: ${serverMessage}`);
    }

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return new Error(
        "Timeout na operação. Verifique sua conexão e tente novamente."
      );
    }

    if (error.code === "ERR_NETWORK") {
      return new Error(
        "Erro de conexão. Verifique se o servidor está funcionando."
      );
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Erro desconhecido";
    return new Error(`Erro ao ${action}: ${errorMessage}`);
  }

  static isAuthenticated() {
    return authService.isAuthenticated();
  }

  static getToken() {
    return authService.getToken();
  }
}

export default MenuService;
