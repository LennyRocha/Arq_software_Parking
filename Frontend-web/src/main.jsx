import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DarkProvider } from "./context/DarkContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkProvider>
      <App />
    </DarkProvider>
  </StrictMode>
);
