import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const DarkContext = React.createContext();

const getCssVar = (name, fallback) => {
  if (typeof window === 'undefined' || !document) return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const DarkProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const theme = React.useMemo(() => {
    // read CSS variables (they change when you toggle the .dark class)
    const primary = getCssVar('--primary', '#4b7c7b');
    const secondary = getCssVar('--secondary', '#7ebebe');
    const tertiary = getCssVar('--other', '#1e3a3e'); 
    const error = getCssVar("--error","#ff5252");
    const success = getCssVar("--success","#ff9800");
    const warning = getCssVar("--warning","#4caf50");
    const info = getCssVar("--info","#2196f3");
    const black = getCssVar("--dark","#1e1e1e");
    const gray = getCssVar("--gray","#808080");

    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: { main: primary },
        secondary: { main: secondary, contrastText: tertiary},
        success: { main: success, contrastText: '#fff' },
        error: { main: error, contrastText: '#fff' },
        info: { main: info, contrastText: '#fff' },
        warning: { main: warning, contrastText: '#fff' },
        // custom palette entry; you can use color="tertiary" on Button
        tertiary: { main: tertiary, contrastText: '#fff' },
        black: { main: black, contrastText: '#fff' },
        gray: { main: gray, contrastText: '#fff' }
      }
    });
  }, [isDarkMode]);

  return (
    <DarkContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkContext.Provider>
  );
};

export const useDarkContext = () => {
  return React.useContext(DarkContext);
};