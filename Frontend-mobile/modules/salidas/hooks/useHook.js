import React from "react";

//Ejemplo muy básico de un hook personalizado
export default function useHook() {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    // Aquí va la lógica del hook
  }, []);
  return { state, setState };
}
