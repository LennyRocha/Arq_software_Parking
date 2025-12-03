import api from "../../../utils/api";

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

  return api.get("/pensionado/private/paginados", { params });
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

  return api.get(`/pensionado/private/historial-pagos/${usuarioPensionId}`, { params });
};

/**
 * Renovar pensión de un usuario (Admin/Empleado)
 */
export const renovarPension = (usuarioPensionId, tipoPensionId) => 
  api.post(`/pensionado/private/${usuarioPensionId}/renovar`, {
    idPension: tipoPensionId,
  });

/**
 * Obtener pensión del usuario autenticado
 */
export const fetchMiPension = () => 
  api.get("/pensionado/cliente/mi-pension");

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

  return api.get("/pensionado/cliente/mi-historial-pagos", { params });
};

/**
 * Renovar pensión del usuario autenticado
 */
export const renovarMiPension = (tipoPensionId) => 
  api.post("/pensionado/cliente/renovar", {
    idPension: tipoPensionId,
  });

/**
 * Crear preferencia de pago para renovación de pensión
 */
export const crearPreferenciaRenovacion = (pensionId, usuarioEmail, usuarioNombre) =>
  api.post("/mercadopago/crear-preferencia", {
    pensionId,
    usuarioEmail,
    usuarioNombre,
  });