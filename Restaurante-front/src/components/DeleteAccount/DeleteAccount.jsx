import React, { useState, useContext } from "react";
import { Trash2, AlertTriangle, Eye, EyeOff, X, Lock } from "lucide-react";
import { AuthContext } from "../App";
import authService from "../services/authService";

const DeleteAccount = ({ user, onAccountDeleted }) => {
  const authContext = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);

  const expectedConfirmText = "DELETAR MINHA CONTA";

  const getCurrentUser = () => {
    if (user) return user;
    if (authContext?.user) return authContext.user;

    const serviceUser = authService.getUser();
    if (serviceUser) return serviceUser;

    try {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser);
    } catch (error) {
      console.error("Erro ao parsear usuário do storage:", error);
    }

    return null;
  };

  const getCurrentToken = () => {
    try {
      const token = authService.getToken();
      if (token) return token;
    } catch (error) {
      console.error("Erro ao obter token do authService:", error);
    }

    const sessionToken = sessionStorage.getItem("token");
    const localToken = localStorage.getItem("token");
    const sessionAuthToken = sessionStorage.getItem("authToken");
    const localAuthToken = localStorage.getItem("authToken");

    return sessionToken || localToken || sessionAuthToken || localAuthToken;
  };

  const isUserAuthenticated = () => {
    const authServiceAuth = authService.isAuthenticated();
    const contextAuth = authContext?.isAuthenticated;
    const isAuthLocal = localStorage.getItem("isAuthenticated") === "true";
    const isAuthSession = sessionStorage.getItem("isAuthenticated") === "true";

    return authServiceAuth || contextAuth || isAuthLocal || isAuthSession;
  };

  const handleDeleteAccount = async () => {
    if (!adminCode.trim()) {
      setError("Código de administrador é obrigatório");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      if (!isUserAuthenticated()) {
        setError("Sessão expirada. Faça login novamente.");
        setDeleting(false);
        handleLogout();
        return;
      }

      const token = getCurrentToken();
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setDeleting(false);
        handleLogout();
        return;
      }

      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError("Dados do usuário não encontrados. Faça login novamente.");
        setDeleting(false);
        return;
      }

      const loginTime = getLoginTime();
      const currentAttempts = attemptCount + 1;
      setAttemptCount(currentAttempts);

      const sessionDuration = loginTime
        ? Date.now() - parseInt(loginTime, 10)
        : 0;

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
            sessionDuration,
            totalAttempts: currentAttempts,
          }),
        }
      );

      if (!adminVerification.ok) {
        throw new Error(
          `Erro na verificação do admin: ${adminVerification.status}`
        );
      }

      const adminResult = await adminVerification.json();

      if (!adminResult.valid) {
        setError(adminResult.message || "Código de administrador inválido");
        setDeleting(false);
        return;
      }

      const userId = getUserId(currentUser);

      if (!userId) {
        setError("ID do usuário não encontrado nos dados");
        setDeleting(false);
        return;
      }

      const deleteResponse = await fetch(
        `http://localhost:3001/usuarios/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.ok) {
        handleLogout();

        if (onAccountDeleted) {
          onAccountDeleted();
        }
      } else {
        const errorData = await deleteResponse.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Erro HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`;

        setError(errorMessage);
      }
    } catch (error) {
      let errorMessage = "Erro ao conectar com o servidor";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const getLoginTime = () => {
    return (
      localStorage.getItem("loginTime") ||
      localStorage.getItem("loginTimestamp") ||
      sessionStorage.getItem("loginTime") ||
      sessionStorage.getItem("loginTimestamp")
    );
  };

  const getUserId = (userData) => {
    return (
      userData.id ||
      userData.userId ||
      userData.ID ||
      userData.user_id ||
      userData.Id
    );
  };

  const handleLogout = () => {
    if (authContext?.logout) {
      authContext.logout();
    }

    if (authService.logout) {
      authService.logout();
    }

    localStorage.clear();
    sessionStorage.clear();

    setTimeout(() => {
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }, 100);
  };

  const resetModal = () => {
    setShowModal(false);
    setAdminCode("");
    setConfirmText("");
    setError("");
    setStep(1);
    setAttemptCount(0);
  };

  const nextStep = () => {
    if (confirmText !== expectedConfirmText) {
      setError(`Digite exatamente: "${expectedConfirmText}"`);
      return;
    }
    setError("");
    setStep(2);
  };

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return (
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Dados Indisponíveis
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              Não foi possível carregar os dados do usuário. Faça login
              novamente para acessar esta funcionalidade.
            </p>
            <button
              onClick={() => handleLogout()}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
    <>
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
                      <p>📧 Email: {currentUser.email}</p>
                      <p>👤 Nome: {currentUser.nome || currentUser.name}</p>
                      <p>🆔 ID: {getUserId(currentUser)}</p>
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
                      <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
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
    </>
  );
};

export default DeleteAccount;
