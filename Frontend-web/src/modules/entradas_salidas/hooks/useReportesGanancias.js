import { useState, useCallback } from "react";
import { searchReporteGananciasPorHoraPaginated, searchReporteGananciasTotales } from "../api/ReportegananciasApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

/**
 * Hook personalizado para manejar el estado y operaciones de reportes de ganancias
 */
export const useReportesGanancias = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Estados de filtros
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  /**
   * Cargar reportes de ganancias por hora con paginación
   */
  const cargarReportesGananciasPaginado = useCallback(async (filtrosActuales = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchReporteGananciasPorHoraPaginated({
        fechaInicial: filtrosActuales.fechaInicial !== undefined ? filtrosActuales.fechaInicial : (fechaInicial || undefined),
        fechaFinal: filtrosActuales.fechaFinal !== undefined ? filtrosActuales.fechaFinal : (fechaFinal || undefined),
        sortOrder: filtrosActuales.ordenDireccion !== undefined ? filtrosActuales.ordenDireccion : ordenDireccion,
        page: filtrosActuales.page !== undefined ? filtrosActuales.page : page,
        size: filtrosActuales.rowsPerPage !== undefined ? filtrosActuales.rowsPerPage : rowsPerPage,
      });

      if (response.data?.success) {
        const data = response.data.data;
        setReportes(data.content || []);
        setTotalElements(data.totalElements || 0);
      } else {
        setError("No se pudieron cargar los reportes");
        setReportes([]);
        setTotalElements(0);
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      setReportes([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [fechaInicial, fechaFinal, ordenDireccion, page, rowsPerPage]);

  /**
   * Consultar reporte de ganancias totales (para reporte personalizado)
   */
  const consultarReporteTotales = useCallback(async (fechaIni, fechaFin) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchReporteGananciasTotales({
        fechaInicial: fechaIni || undefined,
        fechaFinal: fechaFin || undefined,
      });

      if (response.data?.success) {
        return {
          success: true,
          datos: response.data.data
        };
      } else {
        return {
          success: false,
          error: "No se pudieron consultar los datos del reporte"
        };
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    reportes,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    fechaInicial,
    fechaFinal,
    ordenDireccion,
    
    // Setters
    setPage,
    setRowsPerPage,
    setFechaInicial,
    setFechaFinal,
    setOrdenDireccion,
    
    // Funciones
    cargarReportesGananciasPaginado,
    consultarReporteTotales,
  };
};
