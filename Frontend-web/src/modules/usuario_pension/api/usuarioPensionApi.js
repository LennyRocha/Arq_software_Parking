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
export const fetchHistorialPagos = (usuarioPensionId, { page = 0, size = 10, sort = "fechaPago,desc", search = null }) => {
  const params = {
    page,
    size,
    sort,
    ...(search && { search })
  };

  return apiToken.get(`/api/pensionado/private/historial-pagos/${usuarioPensionId}`, { params });
};

/**
 * Renovar pensión de un usuario (Admin/Empleado)
 */
export const renovarPension = (usuarioPensionId, tipoPensionId) => 
  apiToken.post(`/api/pensionado/private/${usuarioPensionId}/renovar`, {
    idPension: tipoPensionId,
  });

/**
 * Obtener pensión del usuario autenticado
 */
export const fetchMiPension = () => 
  apiToken.get("/api/pensionado/cliente/mi-pension");

/**
 * Obtener historial de pagos del usuario autenticado
 */
export const fetchMiHistorialPagos = ({ page = 0, size = 10, sort = "fechaPago,desc", search = null }) => {
  const params = {
    page,
    size,
    sort,
    ...(search && { search })
  };

  return apiToken.get("/api/pensionado/cliente/mi-historial-pagos", { params });
};

/**
 * Renovar pensión del usuario autenticado
 */
export const renovarMiPension = (tipoPensionId) => 
  apiToken.post("/api/pensionado/cliente/renovar", {
    idPension: tipoPensionId,
  });

/**
 * Crear preferencia de pago para renovación de pensión
 */
export const crearPreferenciaRenovacion = (pensionId, usuarioEmail, usuarioNombre) =>
  apiToken.post("/api/mercadopago/crear-preferencia", {
    pensionId,
    usuarioEmail,
    usuarioNombre,
  });
