import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/layout";
import BackgroundImagens from "../components/backgroundImagens/BackgroundImagens.jsx";

function Home() {
  return (
    <Layout>
      <div className="relative min-h-screen w-full bg-gray-200">
        <div className="absolute inset-0 z-0">
          <BackgroundImagens
            webpSrc="/imagens/img_home/foto-home.webp"
            fallbackSrc="/imagens/img_home/foto-home.jpg"
            alt="Interior do Restaurante X"
            className="absolute inset-0 w-full h-full object-cover object-center"
            preload={true}
          />
        </div>

        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-start gap-10 container mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
          <div className="max-w-md text-center md:text-left md:ml-10 lg:ml-20">
            <h1 className="text-orange-600 text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Restaurante X
            </h1>
            <h2 className="text-white text-xl md:text-2xl font-bold mb-4 leading-tight drop-shadow-md">
              Experimente a melhor comida <br className="hidden sm:block" /> da
              região
            </h2>
            <p className="text-gray-200 text-base md:text-lg mb-6 drop-shadow-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea
              corporis et minima iure atque incidunt veritatis accusantium
              pariatur nihil?
            </p>
            <Link
              to="/menu"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver Menu
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
