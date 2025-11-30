import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonInterface from "./cajonInterface";
import api from "../../../utils/api";

export default function useCountCajones() {
  const [isLoading, setLoading] = React.useState(false);
  const [errorData, setErrorData] = React.useState(null);

  const [data, setData] = React.useState(null);
  const [reload, setReload] = React.useState(false);

  const restartCall = () => setReload(prev => !prev);

  const getCajonesCount = React.useCallback(async () => {
    let errorObject = {};

    setLoading(true);
    setErrorData(null);

    try {
      const res = await api.get(
        cajonInterface.contar()
      );
      return res.data;
    } catch (err) {
      errorObject = {
        tipo: err.response ? "Error de la API" : "Error de Axios",
        texto: getAxiosErrorMessage(err),
        detalles: err
      };
      setErrorData(errorObject);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const result = await getCajonesCount();
      setData(result);
    })();
  }, [getCajonesCount, reload]);

  return {
    data,
    isLoading,
    errorData,
    restartCall,
  };
}