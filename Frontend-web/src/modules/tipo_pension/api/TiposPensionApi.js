import apiToken from "../../../utils/apiToken";
import api from "../../../utils/api";

// Obtener todos los tipos de pensión (sin paginado) - Público
export const fetchTiposPension = () => api.get("/api/pension/public");

// Obtener tipos de pensión paginados con filtros y ordenamiento (para admin - requiere auth)
export const searchTiposPensionPaginados = ({
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

  return apiToken.get("/api/pension/private/paginados", { params });
};

// Obtener tipos de pensión ACTIVAS paginados (para landing page) - Público
export const searchTiposPensionActivasPaginados = ({
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

  return api.get("/api/pension/public/activas/paginados", { params });
};

// Crear un nuevo tipo de pensión
export const createTipoPension = (pension) => 
  apiToken.post("/api/pension/private", pension);

// Actualizar un tipo de pensión
export const updateTipoPension = (id, pension) =>
  apiToken.put(`/api/pension/private/${id}`, pension);

// Cambiar estado de un tipo de pensión
export const toggleTipoPensionStatus = (id) =>
  apiToken.put(`/api/pension/private/${id}/status`);
