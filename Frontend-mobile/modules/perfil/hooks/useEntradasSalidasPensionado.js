import { useState } from "react";
import { searchEntradasSalidasPensionadoPaginated } from "../api/EntradaSalidaApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

/**
 * Hook personalizado para gestionar las entradas y salidas de un pensionado
 */
export const useEntradasSalidasPensionado = () => {
  const [entradasSalidas, setEntradasSalidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState("fecha");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");
  const [buscarTexto, setBuscarTexto] = useState("");

  // Cargar entradas y salidas del pensionado con paginación
  const cargarEntradasSalidasPaginado = async () => {
    setLoading(true);
    setError("");
    try {
      const valorBusqueda = buscarTexto.trim();

      const response = await searchEntradasSalidasPensionadoPaginated({
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
      setError(err);
      setEntradasSalidas([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    entradasSalidas,
    loading,
    error,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalElements,
    ordenarPor,
    setOrdenarPor,
    ordenDireccion,
    setOrdenDireccion,
    buscarTexto,
    setBuscarTexto,
    cargarEntradasSalidasPaginado
  };
};
