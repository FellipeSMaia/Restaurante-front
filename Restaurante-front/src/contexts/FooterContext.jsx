import React, { createContext, useState, useContext } from "react";

const FooterContext = createContext();

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooter deve ser usado dentro de um FooterProvider");
  }
  return context;
};

export const FooterProvider = ({ children }) => {
  const [showFooter, setShowFooter] = useState(false);

  const showFooterComponent = () => {
    setShowFooter(true);
  };

  const hideFooterComponent = () => {
    setShowFooter(false);
  };

  const toggleFooter = () => {
    setShowFooter((prev) => !prev);
  };

  const value = {
    showFooter,
    showFooterComponent,
    hideFooterComponent,
    toggleFooter,
  };

  return (
    <FooterContext.Provider value={value}>{children}</FooterContext.Provider>
  );
};

export { FooterContext };
export default FooterProvider;
