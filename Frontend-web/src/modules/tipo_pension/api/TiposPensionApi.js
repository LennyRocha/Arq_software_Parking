import apiToken from "../../../utils/api";

// Obtener todos los tipos de pensión (sin paginado)
export const fetchTiposPension = () => apiToken.get("/api/pension/public");

// Obtener tipos de pensión paginados con filtros y ordenamiento
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

  return apiToken.get("/api/pension/public/paginados", { params });
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
