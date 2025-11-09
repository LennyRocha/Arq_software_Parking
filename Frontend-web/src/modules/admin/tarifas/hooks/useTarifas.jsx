import { useEffect, useState } from "react";
import { fetchTarifas } from "../api/TarifasApi";
import { getAxiosErrorMessage } from "../../../../utils/getAxiosMessage";

export const useTarifas = () => {
  const [tarifas, setTarifas] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(false);
  const [vacio, setVacio] = useState(false);

  const cargarTarifas = async () => {
    setLoading(true);
    setError("");
    setVacio(false); // Reset vacio state
    try {
      const response = await fetchTarifas();
      const data = response.data.data || [];
      setTarifas(data);
      // Solo marcar como vacío si la petición fue exitosa Y no hay datos
      data.length === 0 ? setVacio(true) : setVacio(false);
    } catch (err) {
      setError(getAxiosErrorMessage(err));//Aqui get axios error message retornaria el "No se recibió respuesta del servidor" 
      setTarifas(null); // Mantener como null en caso de error
      setVacio(false); // No marcar como vacío si hay error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTarifas();
  }, [retry]);

  return { tarifas, setTarifas, loading, error, retry, setRetry, setError, vacio, cargarTarifas };
};