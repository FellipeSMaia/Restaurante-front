import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

function Sobre() {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-[#d3d3d3] flex items-center justify-center relative">
      <button
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={voltarParaHome}
      >
        <ChevronLeftIcon />
      </button>
      <div className="w-screen h-screen bg-[#d3d3d3] flex justify-between p-50 ">
        <div className="w-[500px]">
          <h1 className="text-orange-600 text-4xl m-5">Sobre Nós</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
            doloribus laborum ad molestiae ratione aliquam earum. Inventore quae
            excepturi quidem id consectetur corporis culpa perferendis veniam?
            Reiciendis sed quasi quo?
          </p>
        </div>
        <img
          src="/imagens/img_sobre/foto-sobre.png"
          alt="Foto para Page Sobre"
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
}

export default Sobre;
