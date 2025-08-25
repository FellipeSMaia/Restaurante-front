import Layout from "../components/layout/layout";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import api from "../services/api";
import authService from "../services/authService";
import {
  validateEmail,
  validatePassword,
  extractToken,
} from "../utils/validators";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else {
      const passwordCheck = validatePassword(formData.senha);
      if (!passwordCheck.isValid) {
        newErrors.senha =
          "Senha deve ter no mínimo 8 caracteres, incluir maiúscula, minúscula e número";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const closePopup = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/Home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const dataToSend = {
      email: formData.email.toLowerCase().trim(),
      senha: formData.senha,
    };

    try {
      const response = await api.post("/login", dataToSend);

      const userData = response.data.user;
      const finalToken = extractToken(response.data);

      if (!userData) {
        setErrors({ general: "Erro: dados do usuário não recebidos" });
        return;
      }

      if (!finalToken) {
        setErrors({ general: "Erro: token de autenticação não recebido" });
        return;
      }

      const remember = Boolean(formData.rememberMe);

      authService.clearUserData();
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        authService.setUser(userData, remember);
        authService.setToken(finalToken, remember);
        authService.setAdditionalData(userData.email, remember);

        const expectedStorage = remember ? localStorage : sessionStorage;
        const savedToken = expectedStorage.getItem("token");
        const savedUser = expectedStorage.getItem("user");
        const savedIsAuth = expectedStorage.getItem("isAuthenticated");

        if (!savedToken || !savedUser || savedIsAuth !== "true") {
          throw new Error("Dados não foram salvos corretamente nos storages");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${finalToken}`;
      } catch {
        setErrors({
          general: "Erro ao salvar dados de login. Tente novamente.",
        });
        return;
      }

      const eventData = {
        user: userData,
        token: finalToken,
        rememberMe: remember,
      };

      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: eventData,
        })
      );

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("authStateChanged", {
            detail: eventData,
          })
        );
      }, 100);

      if (window.opener) {
        try {
          window.opener.postMessage(
            {
              type: "LOGIN_SUCCESS",
              user: userData,
              token: finalToken,
              rememberMe: remember,
            },
            window.location.origin
          );
        } catch {
          setErrors({
            general: "Erro ao comunicar login com a janela principal.",
          });
        }
      }

      setTimeout(() => closePopup(), 300);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.status === 401) {
        setErrors({ general: "Email ou senha incorretos." });
      } else if (error.response?.status === 404) {
        setErrors({ general: "Usuário não encontrado." });
      } else {
        setErrors({ general: "Falha ao tentar login. Tente novamente." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.senha
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">
                  Lembrar de mim
                </span>
              </label>
              <Link
                to="/esqueci-senha"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/Cadastro"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
