import React from "react";

function Container({ children, className = "" }) {
  return (
    <main
      className={`
        w-full 
        h-full
        flex-1 
        bg-[#d3d3d3] 
        overflow-hidden
        ${className}
      `}
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}

export default Container;
