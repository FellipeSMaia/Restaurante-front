import { CheckCircle } from "lucide-react";

const SuccessScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Cadastro Realizado!
      </h1>
      <p className="text-gray-600 mb-6">
        Seu cadastro foi realizado com sucesso. Você será redirecionado para a
        página de login.
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full animate-pulse"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  </div>
);

export default SuccessScreen;
