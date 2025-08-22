import { useState } from "react";
import api from "../services/api";

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitRegistration = async (formData, setErrors) => {
    setIsLoading(true);
    setErrors({});

    const dataToSend = {
      nome: formData.nome.trim(),
      cpf: formData.cpf.replace(/\D/g, ""),
      endereco: formData.endereco.trim(),
      telefone: formData.telefone.replace(/\D/g, ""),
      email: formData.email.toLowerCase().trim(),
      senha: formData.senha,
      adminCode: formData.adminCode.trim(),
    };

    try {
      await api.post("/usuarios", dataToSend);
      return true; 
    } catch (error) {
      handleRegistrationError(error, setErrors);
      return false; 
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationError = (error, setErrors) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 403:
          setErrors({
            adminCode: data.message || "Código de administrador inválido.",
          });
          break;
        case 409:
          if (data.field === "email") {
            setErrors({ email: "Este email já está cadastrado" });
          } else if (data.field === "cpf") {
            setErrors({ cpf: "Este CPF já está cadastrado" });
          } else {
            setErrors({ general: "Dados já cadastrados no sistema" });
          }
          break;
        case 422:
          if (data.errors) {
            const fieldErrors = {};
            Object.keys(data.errors).forEach((field) => {
              fieldErrors[field] = Array.isArray(data.errors[field])
                ? data.errors[field][0]
                : data.errors[field];
            });
            setErrors(fieldErrors);
          } else {
            setErrors({
              general:
                data.message || "Dados inválidos. Verifique as informações.",
            });
          }
          break;
        case 429:
          setErrors({
            general: "Muitas tentativas. Tente novamente mais tarde.",
          });
          break;
        case 500:
          setErrors({
            general: "Erro interno do servidor. Tente novamente.",
          });
          break;
        default:
          setErrors({
            general:
              data.message ||
              `Erro ${status}: ${data.error || "Erro ao realizar cadastro"}`,
          });
      }
    } else if (error.request) {
      setErrors({
        general: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
    } else {
      setErrors({
        general: `Erro inesperado: ${error.message}`,
      });
    }
  };

  return { submitRegistration, isLoading };
};
