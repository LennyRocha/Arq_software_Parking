import React from "react";
import pensionInterface from "./pensionInterface";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import PensionCard from "../components/PensionCard";
import api from "../../../utils/api";

export default function usePensiones(navigation, pressHanlder) {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [errorData, setErrorData] = React.useState(null);
  const [dependence, setDependence] = React.useState(false);

  const restartCall = () => setDependence(!dependence);

  const getPensiones = React.useCallback(async () => {
    let errorObject = {}
    setLoading(true);
    setError(null);
    setErrorData(null);
    try {
      const res = await api.get(`${pensionInterface.getAll}`);
      setData(res.data);
    } catch (err) {
      errorObject = {
        tipo: err.response ? "Error de la API" : "Error de Axios",
        texto: getAxiosErrorMessage(err),
        detalles: err
      }
      setErrorData(errorObject);
    } finally {
      setLoading(false);
    }
  }, [dependence]);

  React.useEffect(() => {
    getPensiones();
  }, [getPensiones]);

  const renderedList = React.useMemo(() => (
    data?.data.map((item) => {
      if (!item.status) return;
      return (
        <PensionCard key={item.id} pension={item} onPress={pressHanlder} />
      )
    })
  ), [data]);

  return { data, isLoading, error, errorData, renderedList, restartCall };
}