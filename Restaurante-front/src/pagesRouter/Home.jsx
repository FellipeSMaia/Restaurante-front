import React from "react";

function Home() {
  return (
    <div className="w-full h-[700px] bg-gradient-to-r from-gray-200 bg-[#d3d3d3] flex items-center justify-center">
      {/* Imagem do prato */}
      <div className="flex-shrink-0">
        <img
          src="/imagens/img_sobre/foto-sobre.png"
          alt="Foto para Page Sobre"
          className="w-[300px] h-auto object-cover"
        />
      </div>

      {/* Texto ao lado */}
      <div className="p-6 flex flex-col justify-center">
        <h1 className="text-orange-600 text-3xl font-extrabold mb-2">
          Restaurante X
        </h1>
        <h2 className="text-gray-800 text-lg font-bold mb-2 leading-tight">
          Experimente a melhor comida <br /> da região
        </h2>
        <p className="text-gray-600 text-sm mb-4 max-w-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea corporis
          et minima iure atque incidunt veritatis accusantium pariatur nihil?
        </p>
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all text-sm">
          Ver Menu
        </button>
      </div>
    </div>
  );
}

export default Home;
