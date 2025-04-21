import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

function Menu() {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-[#d3d3d3]  flex items-start justify-center relative pt-10">
      <button
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={voltarParaHome}
      >
        <ChevronLeftIcon />
      </button>
      <div className="flex flex-col items-center text-center py-5">
        <h2 className="text-orange-600 text-xl font-serif">Prato do Dia</h2>
        <h1 className="text-4xl font-bold text-gray-800">Cardápio do Dia</h1>

        {/* Div Pratos*/}
        <div className="flex flex-col md:flex-row justify-center gap-15 mt-30">
          {/* Prato 1 */}
          <div className="flex flex-col items-center w-75 h-50 bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-4">
            <img
              src=""
              alt="Carne e legumes"
              className="w-30 h-30 object-cover rounded-lg"
            />
            <h3 className="font-bold text-orange-500 text-lg">
              Carne e legumes
            </h3>
            <p className="text-white text-sm mt-2">Prato delicioso</p>
            <p className="text-white text-sm mt-2">R$22,98</p>
          </div>

          {/* Prato 2 */}
          <div className="flex flex-col items-center w-75 h-50 bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-4">
            <img
              src=""
              alt="Carne e cogumelo"
              className="w-30 h-30 object-cover rounded-lg"
            />
            <h3 className="font-bold text-orange-500  text-lg">
              Carne e cogumelo
            </h3>
            <p className="text-white text-sm mt-2">Prato delicioso</p>
            <p className="text-white text-sm mt-2">R$22,98</p>
          </div>

          {/* Prato 3 */}
          <div className="flex flex-col items-center w-75 h-50 bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-4">
            <img
              src="/images/prato3.png"
              alt="Frango e salada"
              className="w-30 h-30 object-cover rounded-lg"
            />
            <h3 className="font-bold text-orange-500 text-lg">
              Frango e salada
            </h3>
            <p className="text-white text-sm mt-2">Prato delicioso</p>
            <p className="text-white text-sm mt-2">R$22,98</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
