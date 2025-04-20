
// import de rotas
import Home from "./pagesRouter/Home";
import Sobre from "./pagesRouter/Sobre";
import Servico from "./pagesRouter/Servicos";
import Menu from "./pagesRouter/Menu";
import Contato from "./pagesRouter/Contato";
import Entrar from "./pagesRouter/Entrar";

// import de componentes
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Container from "./components/container/Container";
import Footer from "./components/footer/Footer";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="w-screen h-screen bg-slate-200 flex flex-col">
      <Header>
        <Navbar />
      </Header>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servico" element={<Servico />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/entrar" element={<Entrar />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
