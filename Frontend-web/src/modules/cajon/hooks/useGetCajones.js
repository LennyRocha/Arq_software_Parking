import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonInterface from "./cajonInterface";
import api from "../../../utils/api";

export default function useGetCajones() {
  const [isLoading, setLoading] = React.useState(false);
  const [errorData, setErrorData] = React.useState(null);

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);

  const [data, setData] = React.useState(null);
  const [reload, setReload] = React.useState(false);

  const restartCall = () => setReload(prev => !prev);

  const restoreValues = () => {
    setQuery("");
    setSort("");
    setPage(0);
    setSize(10);
    restartCall();
  };

  const getCajones = React.useCallback(async () => {
    let errorObject = {};

    setLoading(true);
    setErrorData(null);

    try {
      const res = await api.get(
        cajonInterface.getAll(sort, query, page, size)
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
  }, [query, sort, page, size]);

  React.useEffect(() => {
    (async () => {
      const result = await getCajones();
      setData(result);
    })();
  }, [getCajones, reload]);

  return {
    data,
    isLoading,
    errorData,
    restartCall,
    restoreValues,
    query, setQuery,
    sort, setSort,
    page, setPage,
    size, setSize
  };
}