import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/layout";

function Home() {
  return (
    <Layout>
      {/* Imagem do prato */}
      <div className="w-full sm:w-auto flex justify-center mb-6 sm:mb-0 sm:mr-10">
        <img
          src="/imagens/img_sobre/foto-sobre.png"
          alt="Foto para Page Sobre"
          className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto object-cover"
        />
      </div>

      {/* Texto ao lado */}
      <div className="max-w-md text-center sm:text-left">
        <h1 className="text-orange-600 text-3xl md:text-4xl font-extrabold mb-2">
          Restaurante X
        </h1>
        <h2 className="text-gray-800 text-lg md:text-xl font-bold mb-2 leading-tight">
          Experimente a melhor comida <br className="hidden sm:block" /> da
          região
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea corporis
          et minima iure atque incidunt veritatis accusantium pariatur nihil?
        </p>
        <Link
          to="/menu"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all text-sm md:text-base"
        >
          Ver Menu
        </Link>
      </div>
    </Layout>
  );
}

export default Home;
