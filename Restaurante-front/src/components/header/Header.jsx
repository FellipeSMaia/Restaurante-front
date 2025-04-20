import Navbar from "../navbar/Navbar";

function Header({ children }) {
  return (
    <header className="w-full bg-white shadow-md">
      {children || <Navbar />}
    </header>
  );
}

export default Header;
