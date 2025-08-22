import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Img } from "react-image";
import Layout from "../components/layout/layout";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const LoadingPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-orange-600 text-lg font-semibold">
            Carregando...
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <div className="text-orange-600 text-lg font-semibold">
            Sem imagem disponível
          </div>
        </div>
      </div>
    </div>
  );

  const BackgroundImage = () =>
    isVisible && (
      <Img
        src={[
          "./imagens/img_home/foto-home.webp",
          "./imagens/img_home/foto-home.jpg",
        ]}
        alt="Interior do Restaurante X"
        loading="lazy"
        loader={<LoadingPlaceholder />}
        unloader={<ErrorFallback />}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    );

  return (
    <Layout>
      <div
        ref={containerRef}
        className="relative min-h-screen w-full bg-gray-200"
      >
        <BackgroundImage />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-start gap-10 container mx-auto w-full flex-grow px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
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
