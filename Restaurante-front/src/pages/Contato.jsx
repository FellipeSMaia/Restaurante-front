import React from "react";
import Layout from "../components/layout/layout";
import { useFooterControl } from "../hooks/useFooterControl";

function Contato() {
  useFooterControl(true);

  return (
    <Layout>
      <div className=" min-w-screen bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 container mx-auto w-full flex-grow px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-orange-600 text-3xl mb-2">App</h1>
            <h2 className="text-2xl font-bold text-black mb-4">
              O Aplicativo estará disponível em Breve
            </h2>
            <p className="text-shadow-black">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
              doloribus laborum ad molestiae ratione aliquam earum. Inventore
              quae excepturi quidem id consectetur corporis culpa perferendis
              veniam? Reiciendis sed quasi quo?
            </p>
          </div>

          <img
            src="/imagens/img_contato/foto-celular.png"
            alt="Foto para Page Contato"
            className="w-48 md:w-64 h-auto"
          />
        </div>
      </div>
    </Layout>
  );
}

export default Contato;
