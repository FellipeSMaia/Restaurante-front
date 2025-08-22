import Navbar from "../navbar/Navbar";

function Header({ children }) {
  return (
    <header className="w-full bg-[#fd8038]">{children || <Navbar />}</header>
  );
}

export default Header;
