import { useState, useCallback } from 'react';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import {
  searchTiposPensionPaginados,
  createTipoPension,
  updateTipoPension,
  toggleTipoPensionStatus
} from '../api/TiposPensionApi';

export default function useTiposPension() {
  // Estado para la tabla
  const [tiposPension, setTiposPension] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vacio, setVacio] = useState(false);

  // Estado para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Estado para filtros y ordenamiento
  const [ordenarPor, setOrdenarPor] = useState("id");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");
  const [buscarTexto, setBuscarTexto] = useState("");

  // Cargar tipos de pensión paginados
  const cargarTiposPensionPaginados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = `${ordenarPor},${ordenDireccion}`;
      const response = await searchTiposPensionPaginados({
        page,
        size: rowsPerPage,
        sort,
        search: buscarTexto || null
      });

      const { content, totalElements: total } = response.data.data;
      
      setTiposPension(content);
      setTotalElements(total);
      setVacio(content.length === 0);
    } catch (error) {
      setError(getAxiosErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto]);

  // Crear nuevo tipo de pensión
  const crearTipoPension = async (tipoPension) => {
    try {
      const response = await createTipoPension(tipoPension);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Actualizar tipo de pensión
  const actualizarTipoPension = async (id, tipoPension) => {
    try {
      const response = await updateTipoPension(id, tipoPension);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Cambiar estado de tipo de pensión
  const actualizarEstadoTipoPension = async (id) => {
    try {
      await toggleTipoPensionStatus(id);
      // Actualizar la lista después de cambiar el estado
      await cargarTiposPensionPaginados();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  return {
    // Estado
    tiposPension,
    loading,
    error,
    vacio,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,

    // Setters
    setTiposPension,
    setLoading,
    setError,
    setVacio,
    setPage,
    setRowsPerPage,
    setTotalElements,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,

    // Acciones
    cargarTiposPensionPaginados,
    crearTipoPension,
    actualizarTipoPension,
    actualizarEstadoTipoPension
  };
}