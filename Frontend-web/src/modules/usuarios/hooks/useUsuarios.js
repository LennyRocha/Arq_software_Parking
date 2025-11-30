import { useState, useCallback } from 'react';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import {
  searchUsuariosPaginados,
  updateUsuario,
  toggleUsuarioStatus,
  restablecerContrasena
} from '../api/usuariosGestionApi';

export default function useUsuarios() {
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
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("");

  // Cargar usuarios paginados
  const cargarUsuariosPaginados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = `${ordenarPor},${ordenDireccion}`;
      const response = await searchUsuariosPaginados({
        page,
        size: rowsPerPage,
        sort,
        search: buscarTexto || null,
        tipoUsuario: tipoUsuarioFiltro || null
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
  }, [page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto, tipoUsuarioFiltro]);

  // Actualizar usuario
  const actualizarUsuario = async (id, usuario) => {
    try {
      const usuarioData = {
        nombre: usuario.nombre.trim(),
        apellidos: usuario.apellidos.trim()
      };
      const response = await updateUsuario(id, usuarioData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Cambiar estado de usuario
  const actualizarEstadoUsuario = async (id) => {
    try {
      await toggleUsuarioStatus(id);
      // Actualizar la lista después de cambiar el estado
      await cargarUsuariosPaginados();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Restablecer contraseña
  const restablecerContrasenaUsuario = async (id) => {
    try {
      await restablecerContrasena(id);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBuscarTexto("");
    setTipoUsuarioFiltro("");
    setOrdenarPor("id");
    setOrdenDireccion("desc");
    setPage(0);
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
    tipoUsuarioFiltro,

    // Setters
    setPage,
    setRowsPerPage,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    setTipoUsuarioFiltro,
    setLoading,

    // Funciones
    cargarUsuariosPaginados,
    actualizarUsuario,
    actualizarEstadoUsuario,
    restablecerContrasenaUsuario,
    limpiarFiltros
  };
}
