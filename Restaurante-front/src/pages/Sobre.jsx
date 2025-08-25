import React from "react";
import Layout from "../components/layout/layout";
import BackgroundImagens from "../components/backgroundImagens/BackgroundImagens.jsx";

function Sobre() {
  return (
    <Layout>
      <div className="relative min-h-screen w-full bg-gray-200">
        <div className="absolute inset-0 z-0">
          <BackgroundImagens
            webpSrc="/imagens/img_sobre/foto-sobre.webp"
            fallbackSrc="/imagens/img_sobre/foto-sobre.jpg"
            alt="Interior do Restaurante X - Sobre nós"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-end gap-10 container mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
          <div className="max-w-md text-center md:text-left md:mr-10 lg:mr-20">
            <h1 className="text-orange-600 text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Sobre Nós
            </h1>
            <p className="text-white text-base md:text-lg mb-6 drop-shadow-sm leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
              doloribus laborum ad molestiae ratione aliquam earum. Inventore
              quae excepturi quidem id consectetur corporis culpa perferendis
              veniam? Reiciendis sed quasi quo? Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Laudantium accusamus perferendis
              est! Perspiciatis, iste numquam vel amet dolor ratione, cumque
              similique molestiae praesentium quos neque voluptate incidunt,
              omnis ab quidem!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Sobre;
