import { useState, useCallback } from "react";
import { fetchUsuariosPensionPaginados, renovarPension } from "../api/usuarioPensionApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export default function useUsuariosPension() {
  // Estado para la tabla
  const [usuarios, setUsuarios] = useState([]);
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

  // Estados para modales
  const [historialModalOpen, setHistorialModalOpen] = useState(false);
  const [renovarModalOpen, setRenovarModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Cargar usuarios pensionados paginados
  const cargarUsuariosPensionadosPaginados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = `${ordenarPor},${ordenDireccion}`;
      const response = await fetchUsuariosPensionPaginados({
        page,
        size: rowsPerPage,
        sort,
        search: buscarTexto || null
      });

      const { content, totalElements: total } = response.data.data;
      
      setUsuarios(content);
      setTotalElements(total);
      setVacio(content.length === 0);
    } catch (error) {
      setError(getAxiosErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto]);

  // Handlers de modales
  const handleVerHistorial = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setHistorialModalOpen(true);
  };

  const handleAbrirRenovar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setRenovarModalOpen(true);
  };

  const handleCerrarHistorial = () => {
    setHistorialModalOpen(false);
    setUsuarioSeleccionado(null);
  };

  const handleCerrarRenovar = () => {
    setRenovarModalOpen(false);
    setUsuarioSeleccionado(null);
  };

  // Renovar pensión de usuario
  const renovarPensionUsuario = async (tipoPensionId) => {
    if (!usuarioSeleccionado) return { success: false };

    try {
      const response = await renovarPension(usuarioSeleccionado.id, tipoPensionId);
      // Recargar la lista después de renovar
      await cargarUsuariosPensionadosPaginados();
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  return {
    // Estado
    usuarios,
    loading,
    error,
    vacio,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    historialModalOpen,
    renovarModalOpen,
    usuarioSeleccionado,

    // Setters
    setUsuarios,
    setLoading,
    setError,
    setVacio,
    setPage,
    setRowsPerPage,
    setTotalElements,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,

    // Modales
    setHistorialModalOpen,
    setRenovarModalOpen,
    setUsuarioSeleccionado,

    // Handlers de modales
    handleVerHistorial,
    handleAbrirRenovar,
    handleCerrarHistorial,
    handleCerrarRenovar,

    // Acciones
    cargarUsuariosPensionadosPaginados,
    renovarPensionUsuario
  };
}
