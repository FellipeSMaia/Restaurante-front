import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Container from "./components/container/Container";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="w-screen min-h-screen bg-[#d3d3d3] flex flex-col">
      <Header>
        <Navbar />
      </Header>
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
