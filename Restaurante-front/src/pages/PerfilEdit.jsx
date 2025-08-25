import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

const DeleteAccount = ({ user, onAccountDeleted }) => {
  const [showModal, setShowModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const expectedConfirmText = "DELETAR MINHA CONTA";

  const handleDeleteAccount = async () => {
    if (!adminCode.trim()) {
      setError("Código de administrador é obrigatório");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setDeleting(false);
        return;
      }

      const adminVerification = await fetch(
        "http://localhost:3001/verify-admin-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminCode: adminCode,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            sessionDuration:
              Date.now() - (localStorage.getItem("loginTime") || Date.now()),
            totalAttempts: 1,
          }),
        }
      );

      const adminResult = await adminVerification.json();

      if (!adminResult.valid) {
        setError(adminResult.message || "Código de administrador inválido");
        setDeleting(false);
        return;
      }

      const deleteResponse = await fetch(
        `http://localhost:3001/usuarios/${user.userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");

        if (onAccountDeleted) {
          onAccountDeleted();
        } else {
          window.location.href = "/home";
        }
      } else {
        const errorData = await deleteResponse.json();
        setError(errorData.message || "Erro ao deletar conta");
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setError("Erro ao conectar com o servidor");
    } finally {
      setDeleting(false);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setAdminCode("");
    setConfirmText("");
    setError("");
    setStep(1);
  };

  const nextStep = () => {
    if (confirmText !== expectedConfirmText) {
      setError(`Digite exatamente: "${expectedConfirmText}"`);
      return;
    }
    setError("");
    setStep(2);
  };

  if (!showModal) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-2">Zona de Perigo</h3>
            <p className="text-sm text-red-800 mb-4">
              Esta ação irá deletar permanentemente sua conta e todos os dados
              associados. Esta ação não pode ser desfeita.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Deletar Conta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Deletar Conta</h2>
            </div>
            <button
              onClick={resetModal}
              className="p-2 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">
                        ⚠️ ATENÇÃO: Ação Irreversível
                      </h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Sua conta será deletada permanentemente</li>
                        <li>• Todos os seus dados serão perdidos</li>
                        <li>• Esta ação NÃO pode ser desfeita</li>
                        <li>• Você não poderá recuperar sua conta</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Conta que será deletada:
                  </h5>
                  <div className="text-sm text-gray-700">
                    <p>📧 Email: {user?.email}</p>
                    <p>👤 Nome: {user?.nome}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Para confirmar, digite:{" "}
                    <span className="text-red-600 font-mono">
                      {expectedConfirmText}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite a confirmação exata..."
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={resetModal}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={nextStep}
                  disabled={!confirmText}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    confirmText
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continuar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">
                        Autenticação Final
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Digite o código de administrador para confirmar a
                        exclusão da conta.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código de Administrador *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showAdminCode ? "text" : "password"}
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite o código de administrador"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminCode(!showAdminCode)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showAdminCode ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={deleting}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={!adminCode || deleting}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    adminCode && !deleting
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {deleting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deletando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Deletar Conta</span>
                    </div>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PerfilEdit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    adminCode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({
            type: "error",
            text: "Token não encontrado. Faça login novamente.",
          });
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3001/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            email: data.user.email || "",
          }));
        } else if (response.status === 401 || response.status === 403) {
          setMessage({
            type: "error",
            text: "Sessão expirada. Faça login novamente.",
          });
          localStorage.removeItem("token");
        } else {
          setMessage({
            type: "error",
            text: "Erro ao carregar dados do usuário.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setMessage({ type: "error", text: "Erro ao conectar com o servidor." });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.adminCode.trim()) {
      newErrors.adminCode = "Código de administrador é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      const adminVerification = await fetch(
        "http://localhost:3001/verify-admin-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminCode: formData.adminCode,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            sessionDuration:
              Date.now() - (localStorage.getItem("loginTime") || Date.now()),
            totalAttempts: 1,
          }),
        }
      );

      const adminResult = await adminVerification.json();

      if (!adminResult.valid) {
        setMessage({
          type: "error",
          text: adminResult.message || "Código de administrador inválido",
        });
        return;
      }

      const updateData = {
        email: formData.email.trim(),
      };

      if (formData.senha.trim()) {
        updateData.senha = formData.senha;
      }

      const updateResponse = await fetch(
        `http://localhost:3001/usuarios/${user.userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        setMessage({
          type: "success",
          text: "Perfil atualizado com sucesso!",
        });

        setFormData((prev) => ({
          ...prev,
          senha: "",
          adminCode: "",
        }));

        if (updateResult.user) {
          setUser((prev) => ({
            ...prev,
            email: updateResult.user.email,
          }));

          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          if (storedUser) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...storedUser,
                email: updateResult.user.email,
              })
            );
          }
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMessage({
          type: "error",
          text: updateResult.message || "Erro ao atualizar perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage({
        type: "error",
        text: "Erro ao conectar com o servidor",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleAccountDeleted = () => {
    window.location.href = "/home";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">
              Carregando perfil...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Editar Perfil
                  </h1>
                  <p className="text-blue-100 mt-1">
                    {user?.email && `Editando: ${user.email}`}
                  </p>
                </div>
              </div>
              <User className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nova Senha{" "}
                <span className="text-gray-500 text-xs">
                  (opcional - deixe vazio para manter atual)
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.senha
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.senha}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código de Administrador *
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showAdminCode ? "text" : "password"}
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.adminCode
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Obrigatório para autorizar alterações"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showAdminCode ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.adminCode && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.adminCode}</span>
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando alterações...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <DeleteAccount user={user} onAccountDeleted={handleAccountDeleted} />

        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Informações de Segurança
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Código de administrador obrigatório para qualquer alteração
                </li>
                <li>
                  • Campo de senha opcional - deixe vazio para manter atual
                </li>
                <li>
                  • Todas as alterações são registradas no sistema para
                  auditoria
                </li>
                <li>• Use uma senha forte com pelo menos 6 caracteres</li>
                <li>
                  • A exclusão de conta é irreversível e requer dupla
                  confirmação
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilEdit;
