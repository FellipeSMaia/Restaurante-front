import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { User } from "lucide-react";
import Layout from "../components/layout/layout";
import FormInput from "../components/common/FormInput";
import ProgressIndicator from "../components/common/ProgressIndicator";
import ErrorAlert from "../components/common/ErrorAlert";
import SuccessScreen from "../components/registration/SuccessScreen";
import { useFormValidation } from "../hooks/useFormValidation";
import { useRegistration } from "../hooks/useRegistration";
import { formatCPF, formatPhone } from "../utils/formatters";

function Cadastro() {
  const navigate = useNavigate();
  const { errors, setErrors, validateStep1, validateStep2 } = useFormValidation();
  const { submitRegistration, isLoading } = useRegistration();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [step, setStep] = useState(1);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalFailedAttempts, setTotalFailedAttempts] = useState(0);
  const [sessionStartTime] = useState(new Date().getTime());
  const [lastActivityTime, setLastActivityTime] = useState(new Date().getTime());

  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 1800000;
  const PROGRESSIVE_BLOCK_MULTIPLIER = 2;

  useEffect(() => {
    let interval;

    if (isBlocked && blockEndTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const remaining = blockEndTime - now;

        if (remaining <= 0) {
          setIsBlocked(false);
          setBlockEndTime(null);
          setAttemptCount(0);
          setTimeRemaining(0);
          setTokenError("");
        } else {
          setTimeRemaining(Math.ceil(remaining / 1000));
        }
      }, 1000);
    }

    const inactivityCheck = setInterval(() => {
      const now = new Date().getTime();
      const inactiveTime = now - lastActivityTime;
      const thirtyMinutes = 30 * 60 * 1000;

      if (inactiveTime > thirtyMinutes && !isBlocked) {
        setAttemptCount(0);
        setTotalFailedAttempts(0);
        setTokenError("");
        setAdminCode("");
      }
    }, 60000);

    return () => {
      if (interval) clearInterval(interval);
      clearInterval(inactivityCheck);
    };
  }, [isBlocked, blockEndTime, lastActivityTime]);

  const updateActivity = () => {
    setLastActivityTime(new Date().getTime());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateBlockDuration = (totalAttempts) => {
    const baseTime = BLOCK_DURATION;
    const multiplier = Math.floor(totalAttempts / MAX_ATTEMPTS);
    return Math.min(
      baseTime * Math.pow(PROGRESSIVE_BLOCK_MULTIPLIER, multiplier),
      7200000
    );
  };

  const blockAttempts = () => {
    const newTotalAttempts = totalFailedAttempts + attemptCount;
    const blockTime = calculateBlockDuration(newTotalAttempts);
    const endTime = new Date().getTime() + blockTime;

    setTotalFailedAttempts(newTotalAttempts);
    setIsBlocked(true);
    setBlockEndTime(endTime);
    setTimeRemaining(Math.ceil(blockTime / 1000));

    const timeText =
      blockTime >= 3600000
        ? `${Math.ceil(blockTime / 3600000)} hora(s)`
        : `${Math.ceil(blockTime / 60000)} minuto(s)`;

    setTokenError(`Muitas tentativas incorretas. Bloqueado por ${timeText}.`);
  };

  const verifyAdminToken = async (token) => {
    try {
      const requestBody = {
        adminCode: token,
        timestamp: new Date().getTime(),
        sessionDuration: new Date().getTime() - sessionStartTime,
        totalAttempts: totalFailedAttempts + attemptCount,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await fetch("http://localhost:3001/verify-admin-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.valid === true) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.error("Erro na verificação do token:", error);
      return false;
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    updateActivity();

    if (isBlocked) {
      setTokenError(
        `Aguarde ${formatTime(timeRemaining)} para tentar novamente.`
      );
      return;
    }

    if (!adminCode.trim()) {
      setTokenError("Por favor, insira o código do administrador");
      return;
    }

    setIsVerifyingToken(true);
    setTokenError("");

    const isValid = await verifyAdminToken(adminCode.trim());

    if (isValid) {
      setTokenVerified(true);
      setTokenError("");
      setAttemptCount(0);
      setTotalFailedAttempts(0);
    } else {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (newAttemptCount >= MAX_ATTEMPTS) {
        blockAttempts();
        setAdminCode("");
      } else {
        const remaining = MAX_ATTEMPTS - newAttemptCount;
        setTokenError(
          `Código inválido. ${remaining} tentativa${
            remaining > 1 ? "s" : ""
          } restante${remaining > 1 ? "s" : ""}.`
        );
      }
    }

    setIsVerifyingToken(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") formattedValue = formatCPF(value);
    else if (name === "telefone") formattedValue = formatPhone(value);
    else if (name === "nome")
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2(formData)) return;

    const formDataWithToken = {
      ...formData,
      adminCode: adminCode.trim(),
    };

    const success = await submitRegistration(formDataWithToken, setErrors);
    
    if (success) {
      setStep(3);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  const nextStep = () => {
    if (validateStep1(formData)) setStep(2);
  };

  const prevStep = () => {
    setErrors({});
    setStep(1);
  };

  if (!tokenVerified) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <LucideIcons.Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Acesso Restrito
              </h1>
              <p className="text-gray-600">
                Digite o código do administrador para acessar o cadastro
              </p>
            </div>

            <form onSubmit={handleTokenSubmit} className="space-y-6">
              {tokenError && (
                <div
                  className={`border rounded-lg p-4 ${
                    isBlocked
                      ? "bg-orange-50 border-orange-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    <LucideIcons.AlertCircle
                      className={`w-5 h-5 mr-2 ${
                        isBlocked ? "text-orange-500" : "text-red-500"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isBlocked ? "text-orange-700" : "text-red-700"
                      }`}
                    >
                      {isBlocked
                        ? `Bloqueado temporariamente. Tempo restante: ${formatTime(
                            timeRemaining
                          )}`
                        : tokenError}
                    </p>
                  </div>
                </div>
              )}

              {totalFailedAttempts >= MAX_ATTEMPTS && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <LucideIcons.Shield className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700 font-medium">
                      Múltiplas tentativas detectadas. Próximos bloqueios serão
                      mais longos.
                    </span>
                  </div>
                </div>
              )}
              
              {!isBlocked && attemptCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucideIcons.AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-yellow-700">
                        Tentativa {attemptCount} de {MAX_ATTEMPTS}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(MAX_ATTEMPTS)].map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index < attemptCount ? "bg-red-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="adminCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Código do Administrador
                </label>
                <div className="relative">
                  <LucideIcons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => {
                      setAdminCode(e.target.value);
                      updateActivity();
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Digite o código secreto"
                    disabled={isVerifyingToken || isBlocked}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifyingToken || isBlocked}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isVerifyingToken || isBlocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isVerifyingToken ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : isBlocked ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LucideIcons.Clock className="w-5 h-5" />
                    <span>Bloqueado ({formatTime(timeRemaining)})</span>
                  </div>
                ) : (
                  "Verificar Acesso"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Não tem permissão para cadastro?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 3) return <SuccessScreen />;

  const step1Fields = [
    {
      name: "nome",
      label: "Nome Completo",
      icon: LucideIcons.User,
      placeholder: "Seu nome completo",
    },
    {
      name: "cpf",
      label: "CPF",
      icon: LucideIcons.CreditCard,
      placeholder: "000.000.000-00",
      maxLength: 14,
    },
    {
      name: "endereco",
      label: "Endereço",
      icon: LucideIcons.MapPin,
      placeholder: "Rua, número, bairro, cidade",
    },
    {
      name: "telefone",
      label: "Telefone",
      icon: LucideIcons.Phone,
      placeholder: "(00) 00000-0000",
      maxLength: 15,
    },
  ];

  const step2Fields = [
    {
      name: "email",
      label: "Email",
      icon: LucideIcons.Mail,
      type: "email",
      placeholder: "seu@email.com",
    },
    {
      name: "senha",
      label: "Senha",
      icon: LucideIcons.Lock,
      type: "password",
      placeholder: "Sua senha",
      showToggle: true,
    },
    {
      name: "confirmarSenha",
      label: "Confirmar Senha",
      icon: LucideIcons.Lock,
      type: "password",
      placeholder: "Confirme sua senha",
      showToggle: true,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-600">
              {step === 1 ? "Informações pessoais" : "Dados de acesso"}
            </p>
            <ProgressIndicator currentStep={step} totalSteps={2} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && <ErrorAlert message={errors.general} />}

            {step === 1 && (
              <>
                {step1Fields.map((field) => (
                  <FormInput
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                    disabled={isLoading}
                  />
                ))}
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Próximo
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {step2Fields.map((field) => (
                  <FormInput
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                    disabled={isLoading}
                  />
                ))}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cadastrando...</span>
                      </div>
                    ) : (
                      "Cadastrar"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cadastro;