import apiToken from "../../../../utils/api";

// Obtener todas las tarifas
export const fetchTarifas = () => apiToken.get("/api/tarifa");

// Obtener todas las tarifas activas
export const fetchTarifasActivas = () => apiToken.get("/api/tarifa/active");

// Obtener una tarifa por ID
export const fetchTarifaByID = (id) => apiToken.get(`/api/tarifa/${id}`);

// Crear una nueva tarifa
export const createTarifa = (tarifa) => apiToken.post("/api/tarifa", tarifa);

// Actualizar una tarifa
export const updateTarifa = (tarifa) => apiToken.put(`/api/tarifa`, tarifa);

// Cambiar estado de una tarifa (activar/desactivar)
export const toggleTarifaStatus = (id) => 
  apiToken.put(`/api/tarifa/${id}/status`);

// Buscar tarifas con filtros, ordenamiento y paginación
export const searchTarifasPaginated = ({
  search = null,
  sortBy = "tipoVehiculo",
  sortOrder = "asc",
  page = 0,
  size = 10
}) => {
  const params = {
    search,
    sortBy,
    sortOrder,
    page,
    size
  };

  return apiToken.get("/api/tarifa/search/paginated", { params });
};

