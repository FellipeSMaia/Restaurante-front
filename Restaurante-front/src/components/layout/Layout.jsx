function Layout({ children, className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center px-4 py-10 ${className}`}
    >
      {children}
    </div>
  );
}

export default Layout;
