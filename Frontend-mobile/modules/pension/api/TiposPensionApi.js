import axios from 'axios';
import { API_URL } from '@env';
import api from "../../../utils/api";

// Obtener todos los tipos de pensión (sin paginado) - Público
export const fetchTiposPension = () => axios.get(`${API_URL}/pension/public`);

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

  return axios.get(`${API_URL}/pension/private/paginados`, { params });
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

  return axios.get(`${API_URL}/api/pension/public/activas/paginados`, { params });
};

// Crear un nuevo tipo de pensión
export const createTipoPension = (pension) =>
  api.post("/pension/private", pension);

// Actualizar un tipo de pensión
export const updateTipoPension = (id, pension) =>
  api.put(`/pension/private/${id}`, pension);

// Cambiar estado de un tipo de pensión
export const toggleTipoPensionStatus = (id) =>
  api.put(`/pension/private/${id}/status`);
