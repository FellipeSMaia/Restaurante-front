import { useState } from 'react';
import { validateCPF } from '../utils/validators';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateStep1 = (formData) => {
    const newErrors = {};
    const step1Fields = ["nome", "cpf", "endereco", "telefone"];

    step1Fields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`;
      }
    });

    if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome)) {
      newErrors.nome = "Nome deve conter apenas letras";
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (formData.endereco.trim().length < 10) {
      newErrors.endereco = "Endereço deve ter pelo menos 10 caracteres";
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (formData) => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 8) {
      newErrors.senha = "Senha deve ter pelo menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      newErrors.senha = "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número";
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, setErrors, validateStep1, validateStep2 };
};