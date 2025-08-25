import { createBrowserRouter, Navigate } from "react-router-dom";
import authService from "../services/authService.jsx";

import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Sobre from "../pages/Sobre.jsx";
import Servico from "../pages/Servico.jsx";
import Menu from "../pages/Menu.jsx";
import Contato from "../pages/Contato.jsx";
import Login from "../pages/Login.jsx";
import Cadastro from "../pages/Cadastro.jsx";
import EsqueciSenha from "../pages/EsqueciSenha.jsx";
import PerfilEdit from "../pages/PerfilEdit.jsx"; 

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Navigate to="/" replace />,
      },
      {
        path: "sobre",
        element: <Sobre />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "servico",
        element: <Servico />,
      },
      {
        path: "contato",
        element: <Contato />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <PublicRoute>
        <Cadastro />
      </PublicRoute>
    ),
  },
  {
    path: "/esqueci-senha",
    element: (
      <PublicRoute>
        <EsqueciSenha />
      </PublicRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <PrivateRoute>
        <PerfilEdit />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
