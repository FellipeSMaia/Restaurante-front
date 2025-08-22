import { Link } from "react-router-dom";
import { useState } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import LoginButton from "../LoginButton";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="font-bold text-gray-800 hover:text-orange-600"
        >
          Restaurante X
        </Link>

        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl p-2 rounded-md"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sobre">Sobre</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/servico">Serviços</Link>
          </li>
          <li>
            <Link to="/contato">Contato</Link>
          </li>

          <li>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <LogOut size={18} />
                <span className="ml-1">Sair</span>
              </button>
            ) : (
              <LoginButton loginPath="/login">
                <User size={18} />
              </LoginButton>
            )}
          </li>
        </ul>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-200 rounded-lg p-4">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/sobre" onClick={closeMenu}>
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/menu" onClick={closeMenu}>
                Menu
              </Link>
            </li>
            <li>
              <Link to="/servico" onClick={closeMenu}>
                Serviços
              </Link>
            </li>
            <li>
              <Link to="/contato" onClick={closeMenu}>
                Contato
              </Link>
            </li>

            <li>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center text-red-600 hover:text-red-800"
                >
                  <LogOut size={18} />
                  <span className="ml-1">Sair</span>
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center text-black hover:text-gray-600"
                >
                  <User size={18} />
                  <span className="ml-1">Entrar</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
