import React from "react";
import { CheckCircle } from "lucide-react";

function SuccessMessage({ successMessage, onBack, onTryAgain }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Enviado!
          </h1>
          <p className="text-gray-600 text-sm">
            Verifique sua caixa de entrada e spam
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Voltar ao Login
          </button>
          <button
            onClick={onTryAgain}
            className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Enviar para outro email
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessage;
