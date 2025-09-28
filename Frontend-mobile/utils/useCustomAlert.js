import { useState } from "react";

export function useCustomAlert() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({});

  // Muestra la alerta con las opciones que le pases
  const showAlert = (options) => {
    setConfig(options);
    setVisible(true);
  };

  // Oculta la alerta
  const hideAlert = () => setVisible(false);

  return { visible, config, showAlert, hideAlert };
}
