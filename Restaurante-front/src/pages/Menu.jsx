import React from "react";
import Layout from "../components/layout/layout";

function Menu() {
  return (
    <Layout>
      {/* Títulos */}
      <div className="text-center mb-10">
        <h2 className="text-orange-600 text-xl font-serif mb-2">
          Prato do Dia
        </h2>
        <h1 className="text-4xl font-bold text-gray-800">Cardápio do Dia</h1>
      </div>

      {/* Cards dos pratos */}
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-7xl w-full">
        {/* Prato 1 */}
        <div className="flex flex-col items-center bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-6 max-w-xs">
          <img
            src="/images/prato1.png"
            alt="Carne e legumes"
            className="w-40 h-40 object-cover rounded-lg"
          />
          <h3 className="font-bold text-orange-500 text-lg mt-4">
            Carne e legumes
          </h3>
          <p className="text-white text-sm mt-2">Prato delicioso</p>
          <p className="text-white text-sm mt-1">R$22,98</p>
        </div>

        {/* Prato 2 */}
        <div className="flex flex-col items-center bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-6 max-w-xs">
          <img
            src="/images/prato2.png"
            alt="Carne e cogumelo"
            className="w-40 h-40 object-cover rounded-lg"
          />
          <h3 className="font-bold text-orange-500 text-lg mt-4">
            Carne e cogumelo
          </h3>
          <p className="text-white text-sm mt-2">Prato delicioso</p>
          <p className="text-white text-sm mt-1">R$22,98</p>
        </div>

        {/* Prato 3 */}
        <div className="flex flex-col items-center bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-6 max-w-xs">
          <img
            src="/images/prato3.png"
            alt="Frango e salada"
            className="w-40 h-40 object-cover rounded-lg"
          />
          <h3 className="font-bold text-orange-500 text-lg mt-4">
            Frango e salada
          </h3>
          <p className="text-white text-sm mt-2">Prato delicioso</p>
          <p className="text-white text-sm mt-1">R$22,98</p>
        </div>
      </div>
    </Layout>
  );
}

export default Menu;
