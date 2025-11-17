import { useState } from "react";
import { searchEntradasSalidasPaginated } from "../api/EntradaSalidaApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export const useEntradasSalidas = () => {
  const [entradasSalidas, setEntradasSalidas] = useState([]);
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

  return {
    entradasSalidas,
    setEntradasSalidas,
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
    cargarEntradasSalidasPaginado
  };
};
