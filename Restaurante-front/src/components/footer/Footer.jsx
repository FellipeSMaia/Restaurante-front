function Footer() {
  return (
    <footer className="w-full bg-[#d3d3d3] text-center text-gray-600 py-4 border-t">
      <p>
        &copy; {new Date().getFullYear()} Meu Site. Todos os direitos
        reservados.
      </p>
    </footer>
  );
}

export default Footer;
