import React from "react";
import Layout from "../components/layout/layout";

function Contato() {
  return (
    <Layout>
      {/* Conteúdo principal: crescer para ocupar o espaço */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-7xl mx-auto w-full flex-grow">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-orange-600 text-3xl mb-2">App</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            O Aplicativo estará disponível em Breve
          </h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
            doloribus laborum ad molestiae ratione aliquam earum. Inventore quae
            excepturi quidem id consectetur corporis culpa perferendis veniam?
            Reiciendis sed quasi quo?
          </p>
        </div>

        <img
          src="/imagens/img_contato/foto-celular.png"
          alt="Foto para Page Contato"
          className="w-48 md:w-64 h-auto"
        />
      </div>

      {/* Footer: fixo no final */}
      <footer className="bg-black text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Endereço</h3>
            <p className="text-gray-300">
              Rua das Flores, 123 - Centro
              <br />
              São Paulo - SP, 01000-000
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Telefone</h3>
            <p className="text-gray-300">
              (11) 98765-4321
              <br />
              (11) 3344-5566
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">E-mail</h3>
            <p className="text-gray-300">contato@exemplo.com</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Redes Sociais</h3>
            <ul className="space-y-2">
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
    </Layout>
  );
}

export default Contato;
