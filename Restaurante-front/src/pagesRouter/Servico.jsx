import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

function Servico() {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-[#d3d3d3] flex items-start justify-center relative pt-10">
      <button
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={voltarParaHome}
      >
        <ChevronLeftIcon />
      </button>
      <div className="flex flex-col items-center text-center py-10">
        <h2 className="text-orange-600 text-xl font-serif">Ofertas</h2>
        <h1 className="text-4xl font-bold text-gray-800">Nossos Serviços</h1>

        <div className="flex flex-col md:flex-row justify-center gap-10 mt-50">
          {/* A melhor comida */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="border-3 border-gray-400 rounded-xl p-4">
              <img
                src="/imagens/img_servico/foto-talheres-servicos.png"
                alt="A melhor comida"
                className="w-15 h-15"
              />
            </div>
            <h3 className="font-bold mt-4 text-lg">A melhor comida</h3>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
              eveniet.
            </p>
          </div>

          {/* Entrega */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="border-3 border-gray-400 rounded-xl p-4">
              <img src="" alt="Entrega" className="w-15 h-15" />
            </div>
            <h3 className="font-bold mt-4 text-lg">Entrega</h3>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
              eveniet.
            </p>
          </div>

          {/* Comida rápida */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="border-3 border-gray-400 rounded-xl p-4">
              <img src="" alt="Comida rápida" className="w-15 h-15" />
            </div>
            <h3 className="font-bold mt-4 text-lg">Comida rápida</h3>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
              eveniet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Servico;
