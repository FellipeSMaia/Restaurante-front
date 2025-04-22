import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Import de rotas
import Sobre from "./pagesRouter/Sobre.jsx";
import Servico from "./pagesRouter/Servico.jsx";
import Menu from "./pagesRouter/Menu.jsx";
import Contato from "./pagesRouter/Contato.jsx";
import Entrar from "./pagesRouter/Entrar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/sobre",
    element: <Sobre />,
  },
  {
    path: "/servico",
    element: <Servico />,
  },
  {
    path: "/Menu",
    element: <Menu />,
  },
  {
    path: "/Contato",
    element: <Contato />,
  },
  {
    path: "/Entrar",
    element: <Entrar />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
