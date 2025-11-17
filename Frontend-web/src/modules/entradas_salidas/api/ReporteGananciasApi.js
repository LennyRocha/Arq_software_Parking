import apiToken from "../../../utils/apiToken";

/**
 * Buscar reportes de ganancias por hora filtrados y paginados
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.fechaInicial - Fecha inicial (opcional, formato YYYY-MM-DD)
 * @param {string} params.fechaFinal - Fecha final (opcional, formato YYYY-MM-DD)
 * @param {string} params.sortOrder - Orden de clasificación: 'asc' o 'desc'
 * @param {number} params.page - Número de página (base 0)
 * @param {number} params.size - Tamaño de página
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const searchReporteGananciasPorHoraPaginated = ({
  fechaInicial,
  fechaFinal,
  sortOrder = "desc",
  page = 0,
  size = 10
}) => {
  const params = {};
  
  // Solo agregar parámetros si tienen valor
  if (fechaInicial) params.fechaInicial = fechaInicial;
  if (fechaFinal) params.fechaFinal = fechaFinal;
  if (sortOrder) params.sortOrder = sortOrder;
  if (page !== undefined) params.page = page;
  if (size !== undefined) params.size = size;

  return apiToken.get("/api/entrada-salida/reportes/ganancias-por-hora", { params });
};

export const searchReporteGananciasTotales = ({
  fechaInicial,
  fechaFinal,
}) => {
  const params = {};
  
  // Solo agregar parámetros si tienen valor
  if (fechaInicial) params.fechaInicial = fechaInicial;
  if (fechaFinal) params.fechaFinal = fechaFinal;

  return apiToken.get("/api/entrada-salida/reportes/ganancias-totales", { params });
};