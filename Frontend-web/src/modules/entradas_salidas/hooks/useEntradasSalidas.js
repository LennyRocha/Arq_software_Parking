import { useState } from "react";
import { searchEntradasSalidasPaginated, createEntradaSalidaVisitante, fetchTiposVehiculos } from "../api/EntradaSalidaApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export const useEntradasSalidas = () => {
  const [entradasSalidas, setEntradasSalidas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState("fecha");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");
  const [buscarTexto, setBuscarTexto] = useState("");

  // Cargar entradas y salidas con paginación
  const cargarEntradasSalidasPaginado = async () => {
    setLoading(true);
    setError("");
    try {
      const valorBusqueda = buscarTexto.trim();

      const response = await searchEntradasSalidasPaginated({
        search: valorBusqueda,
        sortBy: ordenarPor,
        sortOrder: ordenDireccion,
        page: page,
        size: rowsPerPage
      });

      const data = response.data.data;
      setEntradasSalidas(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      setEntradasSalidas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar tipos de vehículos
  const cargarTiposVehiculos = async () => {
    setError("");
    try {
      const response = await fetchTiposVehiculos();
      const data = response.data.data || [];
      setTiposVehiculos(data);
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      setTiposVehiculos([]);
    }
  };

  // Agregar una nueva entrada de visitante
  const agregarNuevaEntrada = async (entrada) => {
    setLoading(true);
    setError("");
    try {
      await createEntradaSalidaVisitante(entrada);

      // Recargar las entradas después de agregar
      await cargarEntradasSalidasPaginado();

      return { success: true };
    } catch (err) {
      setError(getAxiosErrorMessage(err));
      return { success: false, error: getAxiosErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return {
    entradasSalidas,
    setEntradasSalidas,
    tiposVehiculos,
    setTiposVehiculos,
    loading,
    setLoading,
    error,
    setError,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalElements,
    setTotalElements,
    ordenarPor,
    setOrdenarPor,
    ordenDireccion,
    setOrdenDireccion,
    buscarTexto,
    setBuscarTexto,
    cargarEntradasSalidasPaginado,
    cargarTiposVehiculos,
    agregarNuevaEntrada
  };
};
