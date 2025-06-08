import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App.jsx";

// Páginas (rotas)
import Home from "./pagesRouter/Home.jsx";
import Sobre from "./pagesRouter/Sobre.jsx";
import Servico from "./pagesRouter/Servico.jsx";
import Menu from "./pagesRouter/Menu.jsx";
import Contato from "./pagesRouter/Contato.jsx";
import Entrar from "./pagesRouter/Entrar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Navigate to="/" replace /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/servico", element: <Servico /> },
      { path: "/menu", element: <Menu /> },
      { path: "/contato", element: <Contato /> },
      { path: "/entrar", element: <Entrar /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
