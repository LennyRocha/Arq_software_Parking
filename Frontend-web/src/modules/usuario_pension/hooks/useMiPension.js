import { useState, useCallback } from "react";
import { 
  fetchMiPension, 
  fetchMiHistorialPagos,
  renovarMiPension,
  crearPreferenciaRenovacion 
} from "../api/usuarioPensionApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export default function useMiPension() {
  // Estado para la pensión del usuario
  const [pension, setPension] = useState(null);
  const [loadingPension, setLoadingPension] = useState(false);
  const [errorPension, setErrorPension] = useState(null);

  // Estado para historial de pagos
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);

  // Estado para paginación del historial
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Estado para filtros y ordenamiento del historial
  const [ordenarPor, setOrdenarPor] = useState("fechaPago");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  // Estados para modal de renovar
  const [renovarModalOpen, setRenovarModalOpen] = useState(false);

  // Cargar pensión del usuario autenticado
  const cargarMiPension = useCallback(async () => {
    setLoadingPension(true);
    setErrorPension(null);
    try {
      const response = await fetchMiPension();
      setPension(response.data.data);
    } catch (error) {
      setErrorPension(getAxiosErrorMessage(error));
    } finally {
      setLoadingPension(false);
    }
  }, []);

  // Cargar historial de pagos del usuario autenticado
  const cargarMiHistorial = useCallback(async () => {
    setLoadingHistorial(true);
    setErrorHistorial(null);
    try {
      const sort = `${ordenarPor},${ordenDireccion}`;
      const response = await fetchMiHistorialPagos({
        page,
        size: rowsPerPage,
        sort
      });

      const { content, totalElements: total } = response.data.data;
      
      setHistorial(content);
      setTotalElements(total);
    } catch (error) {
      setErrorHistorial(getAxiosErrorMessage(error));
    } finally {
      setLoadingHistorial(false);
    }
  }, [page, rowsPerPage, ordenarPor, ordenDireccion]);

  // Handlers de modales
  const handleAbrirRenovar = () => {
    setRenovarModalOpen(true);
  };

  const handleCerrarRenovar = () => {
    setRenovarModalOpen(false);
  };

  // Iniciar proceso de pago con Mercado Pago
  const iniciarPagoRenovacion = async (tipoPension) => {
    try {
      if (!pension) {
        return {
          success: false,
          error: 'No se ha cargado la información de la pensión',
        };
      }

      const response = await crearPreferenciaRenovacion(
        tipoPension.id,
        pension.correo,
        pension.correo // Usar correo como nombre porque el DTO no incluye nombre/apellidos
      );
      
      const preferenceData = response.data.data;
      
      console.log('=== DATOS COMPLETOS DE LA RESPUESTA (RENOVACIÓN) ===');
      console.log('Response completo:', response);
      console.log('Preference Data:', preferenceData);
      
      // Buscar URL de pago
      const paymentUrl = 
        preferenceData.sandboxInitPoint || 
        preferenceData.sandbox_init_point ||
        preferenceData.initPoint || 
        preferenceData.init_point;
      
      if (!paymentUrl) {
        console.error('❌ NO SE ENCONTRÓ URL DE PAGO en ninguna propiedad');
        return {
          success: false,
          error: 'No se recibió URL de pago de Mercado Pago. Verifica la respuesta en consola.',
        };
      }
      
      // Retornar la URL de pago para redireccionar
      return {
        success: true,
        preferenceId: preferenceData.id,
        initPoint: paymentUrl,
      };
    } catch (error) {
      console.error('❌ Error en iniciarPagoRenovacion:', error);
      return {
        success: false,
        error: getAxiosErrorMessage(error),
      };
    }
  };

  // Confirmar renovación después del pago
  const confirmarRenovacion = async (tipoPensionId) => {
    try {
      const response = await renovarMiPension(tipoPensionId);
      
      // Recargar la pensión y el historial después de renovar
      await cargarMiPension();
      await cargarMiHistorial();
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(error)
      };
    }
  };

  // Handlers para paginación del historial
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    // Estado de pensión
    pension,
    loadingPension,
    errorPension,
    cargarMiPension,

    // Estado de historial
    historial,
    loadingHistorial,
    errorHistorial,
    cargarMiHistorial,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    setOrdenarPor,
    setOrdenDireccion,
    handleChangePage,
    handleChangeRowsPerPage,

    // Modal de renovar
    renovarModalOpen,
    handleAbrirRenovar,
    handleCerrarRenovar,

    // Renovación con pago
    iniciarPagoRenovacion,
    confirmarRenovacion,
  };
}
