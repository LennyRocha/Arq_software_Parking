import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";

export default function useVehiculos(idUser) {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [errorData, setErrorData] = React.useState(null);

  // Estados del filtro
  const [query, setQuery] = React.useState("");
  const [idCar, setIdCar] = React.useState(0);
  const [active, setActive] = React.useState(null);
  const [conPlacas, setConPlacas] = React.useState(null);

  // Estados temporales para el debounce y filtros
  const [search, setSearch] = React.useState(""); // búsqueda final
  const [filters, setFilters] = React.useState({
    idCar: 0,
    active: null,
    conPlacas: null
  });

  // Función real para traer vehículos
  const fetchVehicles = React.useCallback(async () => {
    if (!idUser) return;

    setLoading(true);
    setErrorData(null);

    try {
      const res = await api.get(
        vehiculoInterface.getAllByUser(idUser, search, filters.idCar, filters.active, filters.conPlacas)
      );
      setData(res.data);
    } catch (err) {
      setErrorData({
        tipo: err.response ? "Error de la API" : "Error de Axios",
        texto: getAxiosErrorMessage(err),
        detalles: err
      });
    } finally {
      setLoading(false);
    }
  }, [idUser, search, filters]);

  // ⏳ Debounce de la búsqueda
  React.useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(query);   // solo ejecuta búsqueda cuando pasan 500ms
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  // Cuando cambia la búsqueda final o filtros → llamar al backend
  React.useEffect(() => {
    fetchVehicles();
  }, [search, filters]);

  const applyFilters = (idCar, active, conPlacas) => {
    setFilters({ idCar, active, conPlacas });
  };

  const restoreValues = () => {
    setQuery("");
    applyFilters(0, null, null);
  };

  return {
    data,
    isLoading,
    errorData,
    query, setQuery,
    idCar, setIdCar,
    active, setActive,
    conPlacas, setConPlacas,
    applyFilters,
    restoreValues,
    refetch: fetchVehicles
  };
}