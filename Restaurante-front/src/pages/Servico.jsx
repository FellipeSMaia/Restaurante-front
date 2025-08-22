import React from "react";
import Layout from "../components/layout/layout";

function Servico() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-700">
                Nossos Serviços
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="border-2 border-orange-400 rounded-xl p-6 mb-6 bg-orange-50">
                <img
                  src="/imagens/img_servico/comida.jpg"
                  alt="A melhor comida"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                A melhor comida
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pratos preparados com ingredientes frescos e selecionados,
                garantindo qualidade e sabor incomparáveis em cada refeição.
              </p>
            </div>

            <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="border-2 border-orange-400 rounded-xl p-6 mb-6 bg-orange-50">
                <img
                  src="/imagens/img_servico/entregador.jpg"
                  alt="Entrega"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                Entrega Rápida
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Entrega expressa em toda a região, mantendo a temperatura e
                qualidade dos pratos até chegar à sua mesa.
              </p>
            </div>

            <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="border-2 border-orange-400 rounded-xl p-6 mb-6 bg-orange-50">
                <img
                  src="/imagens/img_servico/preparo.png"
                  alt="Comida rápida"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                Preparo Ágil
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Processo otimizado de preparo que garante agilidade sem
                comprometer a qualidade e o sabor dos nossos pratos.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">
                Por que escolher nossos serviços?
              </h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
                Combinamos tradição culinária com inovação, oferecendo uma
                experiência gastronômica completa que vai desde a qualidade dos
                ingredientes até a excelência no atendimento e entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Servico;
