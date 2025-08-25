import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import api from "../services/api";
import SuccessMessage from "../components/SucessMessage/SucessMessage";
import ForgotPasswordForm from "../components/ForgotPasswordForm/ForgotPasswordForm";

const DEFAULT_SUCCESS_MESSAGE =
  "Um link de recuperação foi enviado para o email informado";

function EsqueciSenha() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setIsSuccess(false);

    try {
      const dataToSend = { email: formData.email.toLowerCase().trim() };
      const response = await api.post("/esqueci-senha", dataToSend);

      setIsSuccess(true);
      setSuccessMessage(
        response.data.message ||
          DEFAULT_SUCCESS_MESSAGE.replace("email informado", formData.email)
      );
      setFormData({ email: "" });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          setErrors({ email: "Este email não está cadastrado no sistema" });
        } else if (status === 429) {
          setErrors({
            general: "Muitas tentativas. Tente novamente em alguns minutos",
          });
        } else if (status === 500) {
          setErrors({
            general: "Erro interno do servidor. Tente novamente mais tarde",
          });
        } else if (data?.message) {
          setErrors(
            data.field
              ? { [data.field]: data.message }
              : { general: data.message }
          );
        } else {
          setErrors({ general: "Erro ao enviar email de recuperação" });
        }
      } else if (error.request) {
        setErrors({ general: "Erro de conexão. Verifique sua internet" });
      } else {
        setErrors({ general: "Erro inesperado. Tente novamente" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <Layout>
      {isSuccess ? (
        <SuccessMessage
          successMessage={successMessage}
          onBack={() => navigate("/login")}
          onTryAgain={() => {
            setIsSuccess(false);
            setSuccessMessage("");
            setFormData({ email: "" });
            setErrors({});
          }}
        />
      ) : (
        <ForgotPasswordForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          onBack={() => navigate("/login")}
        />
      )}
    </Layout>
  );
}

export default EsqueciSenha;
