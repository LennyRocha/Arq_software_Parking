import React from "react";

const DarkContext = React.createContext();

export const DarkProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkContext.Provider>
  );
};

export const useDarkContext = () => {
  return React.useContext(DarkContext);
};
