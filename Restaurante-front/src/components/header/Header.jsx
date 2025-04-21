import Navbar from "../navbar/Navbar";

function Header({ children }) {
  return (
    <header className="w-full bg-[#d3d3d3]">{children || <Navbar />}</header>
  );
}

export default Header;
