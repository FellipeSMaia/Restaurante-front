function Container({ children, className = "" }) {
  return <main className={`w-full bg-[#d3d3d3] ${className}`}>{children}</main>;
}

export default Container;
