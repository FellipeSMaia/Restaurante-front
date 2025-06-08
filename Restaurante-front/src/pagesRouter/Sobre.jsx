import React from "react";

function Sobre() {
  return (
    <div className="w-full min-h-screen bg-[#d3d3d3] flex flex-wrap items-center justify-center px-4 py-10">
      {/* Imagem */}
      <div className="w-full sm:w-auto flex justify-center mb-6 sm:mb-0 sm:mr-10">
        <img
          src="/imagens/img_sobre/foto-sobre.png"
          alt="Foto Sobre"
          className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto object-cover"
        />
      </div>

      {/* Texto */}
      <div className="max-w-md text-center sm:text-left">
        <h1 className="text-orange-600 text-3xl md:text-4xl font-extrabold mb-4">
          Sobre Nós
        </h1>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
          doloribus laborum ad molestiae ratione aliquam earum. Inventore quae
          excepturi quidem id consectetur corporis culpa perferendis veniam?
          Reiciendis sed quasi quo?
        </p>
      </div>
    </div>
  );
}

export default Sobre;
