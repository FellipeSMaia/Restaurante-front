import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

function Contato() {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#d3d3d3] relative">
      <button
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={voltarParaHome}
      >
        <ChevronLeftIcon />
      </button>

      {/* Conteúdo principal */}
      <div className="flex flex-1 items-center justify-center gap-8 px-4 mt-20">
        <div className="w-[500px]">
          <h1 className="text-orange-600 text-2xl">App</h1>
          <h2 className="text-2xl font-bold text-gray-800">
            O Aplicativo estará disponível em Breve
          </h2>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
            doloribus laborum ad molestiae ratione aliquam earum. Inventore quae
            excepturi quidem id consectetur corporis culpa perferendis veniam?
            Reiciendis sed quasi quo?
          </p>
        </div>

        <img
          src="/imagens/img_contato/foto-celular.png"
          alt="Foto para Page Contato"
          className="w-[200px] h-auto"
        />
      </div>

      {/* Footer - Contatos */}
      <footer className=" bg-black  text-white py-2 mt-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Endereço */}
          <div>
            <h3 className="font-semibold text-lg mb-1">Endereço</h3>
            <p className="text-gray-100">
              Rua das Flores, 123 - Centro
              <br />
              São Paulo - SP, 01000-000
            </p>
          </div>

          {/* Telefone */}
          <div>
            <h3 className="font-semibold text-lg mb-1">Telefone</h3>
            <p className="text-gray-300">
              (11) 98765-4321
              <br />
              (11) 3344-5566
            </p>
          </div>

          {/* E-mail */}
          <div>
            <h3 className="font-semibold text-lg mb-1">E-mail</h3>
            <p className="text-gray-300">contato@exemplo.com</p>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-semibold text-lg mb-1">Redes Sociais</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:underline"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contato;
