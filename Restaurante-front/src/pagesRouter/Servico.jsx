import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

function Servico() {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-slate-200  flex items-start justify-center relative pt-10">
      <button
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={voltarParaHome}
      >
        <ChevronLeftIcon />
      </button>
      <div className="w-[500px] flex flex-col items-center justify-start text-center">
        <h1 className="text-orange-600 text-2xl pt-10 p-2 font-serif">
          Ofertas
        </h1>
        <p className="text-black text-4xl font-mono">Nossos Serviços</p>
      </div>
    </div>
  );
}

export default Servico;
