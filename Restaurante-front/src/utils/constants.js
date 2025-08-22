import { capitalizeFirstLetter } from "./formatters";

export const FIELD_CONFIG = {
  STEP_1: [
    {
      name: "nome",
      label: "Nome Completo",
      icon: "User",
      placeholder: "Seu nome completo",
      autoComplete: "name",
    },
    {
      name: "cpf",
      label: "CPF",
      icon: "CreditCard",
      placeholder: "000.000.000-00",
      maxLength: 14,
      autoComplete: "off",
    },
    {
      name: "endereco",
      label: "Endereço",
      icon: "MapPin",
      placeholder: "Rua, número, bairro, cidade",
      autoComplete: "address-line1",
    },
    {
      name: "telefone",
      label: "Telefone",
      icon: "Phone",
      type: "tel",
      placeholder: "(00) 00000-0000",
      maxLength: 15,
      autoComplete: "tel",
    },
  ],
  STEP_2: [
    {
      name: "email",
      label: "Email",
      icon: "Mail",
      type: "email",
      placeholder: "seu@email.com",
      autoComplete: "email",
    },
    {
      name: "senha",
      label: "Senha",
      icon: "Lock",
      type: "password",
      placeholder: "Sua senha",
      showToggle: true,
      autoComplete: "new-password",
    },
    {
      name: "confirmarSenha",
      label: "Confirmar Senha",
      icon: "Lock",
      type: "password",
      placeholder: "Confirme sua senha",
      showToggle: true,
      autoComplete: "new-password",
    },
    {
      name: "adminCode",
      label: "Código do administrador",
      icon: "Lock",
      placeholder: "Insira o código secreto",
      autoComplete: "off",
    },
  ],
};

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    REGEX: /^[a-zA-ZÀ-ÿ\s]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REGEX: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  ADDRESS: {
    MIN_LENGTH: 10,
  },
  PHONE: {
    MIN_LENGTH: 10,
  },
};

export const ERROR_MESSAGES = {
  REQUIRED: (field) => `${capitalizeFirstLetter(field)} é obrigatório`,
  MIN_LENGTH: (field, length) =>
    `${capitalizeFirstLetter(field)} deve ter pelo menos ${length} caracteres`,
  INVALID_FORMAT: (field) => `${capitalizeFirstLetter(field)} inválido`,
  PASSWORDS_DONT_MATCH: "Senhas não coincidem",
  INVALID_NAME: "Nome deve conter apenas letras",
  INVALID_PASSWORD:
    "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
};
