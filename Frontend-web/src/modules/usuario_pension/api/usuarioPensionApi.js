import apiToken from "../../../utils/apiToken";

/**
 * Obtener usuarios pensionados paginados con filtros y ordenamiento
 */
export const fetchUsuariosPensionPaginados = ({
  page = 0,
  size = 10,
  sort = "id,desc",
  search = null
}) => {
  const params = {
    page,
    size,
    sort,
    ...(search && { search })
  };

  return apiToken.get("/api/pensionado/private/paginados", { params });
};

/**
 * Obtener historial de pagos de un usuario pensionado
 */
export const fetchHistorialPagos = (usuarioPensionId, { page = 0, size = 10, sort = "fechaPago,desc" }) => {
  const params = {
    page,
    size,
    sort,
  };

  return apiToken.get(`/api/pensionado/private/historial-pagos/${usuarioPensionId}`, { params });
};

/**
 * Renovar pensión de un usuario
 */
export const renovarPension = (usuarioPensionId, tipoPensionId) => 
  apiToken.post(`/api/pensionado/private/${usuarioPensionId}/renovar`, {
    idPension: tipoPensionId,
  });
