import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      {/* estilizar essa div */}
      <div className="text-1xl font-bold text-gray-800">
        <h1>Restaurante X</h1>
      </div>
      <button
        className="md:hidden text-2xl text-gray-800"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>
      <ul className="hidden md:flex space-x-6 font-bold text-gray-800">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sobre">Sobre</Link>
        </li>
        <li>
          <Link to="/servico">Serviços</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/contato">Contato</Link>
        </li>
        <li>
          <Link to="/entrar">Entrar</Link>
        </li>
      </ul>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white flex flex-col items-start p-4 shadow-md md:hidden z-10 space-y-2">
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/sobre" onClick={() => setIsMenuOpen(false)}>
              Sobre
            </Link>
          </li>
          <li>
            <Link to="/servico" onClick={() => setIsMenuOpen(false)}>
              Serviços
            </Link>
          </li>
          <li>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
              Contato
            </Link>
          </li>
          <li>
            <Link to="/entrar" onClick={() => setIsMenuOpen(false)}>
              Entrar
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
