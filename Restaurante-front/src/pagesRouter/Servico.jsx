import React from "react";

function Servico() {
  return (
    <div className="w-full min-h-screen bg-[#d3d3d3] flex flex-col items-center px-4 py-10">
      <h2 className="text-orange-600 text-xl font-serif mb-2">Ofertas</h2>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Nossos Serviços</h1>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl w-full">
        {/* Serviço 1 */}
        <div className="flex flex-col items-center max-w-xs text-center">
          <div className="border-2 border-gray-400 rounded-xl p-4 mb-4">
            <img
              src="/imagens/img_servico/foto-talheres-servicos.png"
              alt="A melhor comida"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="font-bold text-lg mb-2">A melhor comida</h3>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
            eveniet.
          </p>
        </div>

        {/* Serviço 2 */}
        <div className="flex flex-col items-center max-w-xs text-center">
          <div className="border-2 border-gray-400 rounded-xl p-4 mb-4">
            <img
              src="/imagens/img_servico/entrega.png"
              alt="Entrega"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="font-bold text-lg mb-2">Entrega</h3>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
            eveniet.
          </p>
        </div>

        {/* Serviço 3 */}
        <div className="flex flex-col items-center max-w-xs text-center">
          <div className="border-2 border-gray-400 rounded-xl p-4 mb-4">
            <img
              src="/imagens/img_servico/comida-rapida.png"
              alt="Comida rápida"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="font-bold text-lg mb-2">Comida rápida</h3>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
            eveniet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Servico;
