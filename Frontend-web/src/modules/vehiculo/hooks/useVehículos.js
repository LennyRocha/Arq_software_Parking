import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";

export default function useVehiculos(idUser) {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [errorData, setErrorData] = React.useState(null);
  const [dependence, setDependence] = React.useState(false);

  const [query, setQuery] = React.useState("");
  const [idCar, setIdCar] = React.useState(0);
  const [active, setActive] = React.useState(null);
  const [conPlacas, setConPlacas] = React.useState(null);

  const restartCall = () => setDependence(!dependence);

  const restoreValues = () => {
    setQuery("");
    setIdCar(0);
    setActive(null);
    setConPlacas(null);
    restartCall();
  }

  const getVehiculos = React.useCallback(async () => {
    let errorObject = {}

    setLoading(true);
    setErrorData(null);

    try {
      const res = await api.get(
        vehiculoInterface.getAllByUser(idUser, query, idCar, active, conPlacas)
      );
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
  }, [idUser, query, idCar, active, conPlacas, dependence]);

  React.useEffect(() => {
    if (idUser) {
      getVehiculos();
    }
  }, [idCar, active, conPlacas, idUser]);

  return { getVehiculos, data, isLoading, errorData, restoreValues, restartCall, query, setQuery, idCar, setIdCar, active, setActive, conPlacas, setConPlacas };
}