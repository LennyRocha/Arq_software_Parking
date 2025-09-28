import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { Appearance } from "react-native";

// Definimos nuestros posibles temas
const lightTheme = {
  primary: "#4B7C7B",
  secondary: "#7EBEBE",
  background: "#F0F9F9",
  surface: "#C5E4E7",
  other: "#1E3A3E",
  gray: "#808080",
  error: "#FF5252",
  warning: "#FF9800",
  success: "#4CAF50",
  info: "#2196F3",
  dark: "#1E1E1E",
};

const darkTheme = {
  primary: "#397974",
  secondary: "#5EB0A9",
  background: "#E2F3F3",
  surface: "#A2E6E5",
  other: "#1F4D4C",
  gray: "#B3B3B3",
  error: "#BD0000",
  warning: "#E65100",
  success: "#0B6E00",
  info: "#1976D2",
  dark: "#424242",
};

// Creamos un contexto
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );

  const [mode, setMode] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    };
    const subscription = Appearance.addChangeListener(listener);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    setMode(theme === darkTheme ? "dark" : "light");
  }, [theme]);

  // Función para cambiar el tema manualmente
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usamos el contexto
export const useCustomThemes = () => {
  return useContext(ThemeContext);
};
