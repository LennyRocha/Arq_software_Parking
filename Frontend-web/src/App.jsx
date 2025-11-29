import { useEffect } from "react";
import "./App.css";
import { useDarkContext } from "./context/DarkContext";
import Rutas from './routes/rutas'
import { useTheme } from "@mui/material";

function App() {
  const { isDarkMode } = useDarkContext();
  const theme = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <Rutas />
    </>
  );
}

export default App;