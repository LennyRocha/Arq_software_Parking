import apiToken from "../../../utils/apiToken";

// Obtener usuarios paginados con filtros y ordenamiento (requiere auth - solo admin)
export const searchUsuariosPaginados = ({
  page = 0,
  size = 10,
  sort = "id,desc",
  search = null,
  tipoUsuario = null
}) => {
  const params = {
    page,
    size,
    sort,
    ...(search && { search }),
    ...(tipoUsuario && { tipoUsuario })
  };

  return apiToken.get("/api/users/private/getAll", { params });
};

// Actualizar datos básicos de usuario (nombre y apellidos)
export const updateUsuario = (id, usuario) =>
  apiToken.put(`/api/users/private/${id}`, usuario);

// Cambiar estado de un usuario
export const toggleUsuarioStatus = (id) =>
  apiToken.put(`/api/users/private/${id}/status`);

// Restablecer contraseña de usuario
export const restablecerContrasena = (id) =>
  apiToken.post(`/api/users/private/${id}/restablecer-contrasena`);
