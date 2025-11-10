import { useEffect, useState } from "react";
import { fetchTarifas, searchTarifasPaginated, toggleTarifaStatus, fetchTiposVehiculos, createTarifa } from "./../api/TarifasApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export const useTarifas = () => {
  const [tarifas, setTarifas] = useState(null);
  const [tiposVehiculos, setTiposVehiculos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(false);
  const [vacio, setVacio] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState("tipoVehiculo");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");
  const [buscarTexto, setBuscarTexto] = useState("");


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

  // Cargar tarifas con paginación
  const cargarTarifasPaginado = async () => {
    setLoading(true);
    setError("");
    try {
      // Determinar si es búsqueda por tiempo o costo
      const valorBusqueda = buscarTexto.trim();

      const response = await searchTarifasPaginated({
        search: valorBusqueda,
        sortBy: ordenarPor,
        sortOrder: ordenDireccion,
        page: page,
        size: rowsPerPage
      });

      const data = response.data.data;
      setTarifas(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      setTarifas([]);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el estado de la tarifa
  const actualizarEstadoTarifa = async (idTarifa) => {
    setLoading(true);
    setError("");
    try {
      await toggleTarifaStatus(idTarifa);
      
      // Recargar las tarifas después de actualizar
      await cargarTarifasPaginado();
      
      return { success: true };
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      return { success: false, error: getAxiosErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  // Carga los tipos de vehiculos de la base de datos
  const cargarTiposVehiculos = async () => {
    setError("");
    try {
      const response = await fetchTiposVehiculos();
      const data = response.data.data || [];
      setTiposVehiculos(data);
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      setTiposVehiculos([]); // Array vacío en caso de error
    }
  };

  // Agregar una nueva tarifa
  const agregarNuevaTarifa = async (tarifa) => {
    setLoading(true);
    setError("");
    try {
      await createTarifa(tarifa);
      
      // Recargar las tarifas después de agregar
      await cargarTarifasPaginado();
      
      return { success: true };
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      return { success: false, error: getAxiosErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTarifasPaginado();
  }, [retry]);

  return {
    tarifas, setTarifas,
    tiposVehiculos, setTiposVehiculos,
    loading, setLoading,
    error, setError,
    retry, setRetry,
    vacio, setVacio,
    page, setPage,
    rowsPerPage, setRowsPerPage,
    totalElements, setTotalElements,
    ordenarPor, setOrdenarPor,
    ordenDireccion, setOrdenDireccion,
    buscarTexto, setBuscarTexto,
    cargarTarifas, cargarTarifasPaginado, actualizarEstadoTarifa, cargarTiposVehiculos, agregarNuevaTarifa
  };
};