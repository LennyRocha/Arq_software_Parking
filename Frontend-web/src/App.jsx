import { useEffect } from "react";
import "./App.css";
import { useDarkContext } from "./context/DarkContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Rutas from "./routes/rutas";
import getTheme from "./utils/getTheme";

function App() {
  const { isDarkMode } = useDarkContext();

  const theme = getTheme(isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Rutas />
    </ThemeProvider>
  );
}

export default App;
