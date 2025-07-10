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
import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";
import Servico from "./pages/Servico.jsx";
import Menu from "./pages/Menu.jsx";
import Contato from "./pages/Contato.jsx";
import Entrar from "./pages/Entrar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Navigate to="/" replace /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/menu", element: <Menu /> },
      { path: "/servico", element: <Servico /> },
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
