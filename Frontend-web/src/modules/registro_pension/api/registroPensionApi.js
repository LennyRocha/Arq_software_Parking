import apiToken from "../../../utils/api";

// Obtener todos los tipos de pensión activos
export const fetchTiposPensionActivos = () => 
  apiToken.get("/api/pension/public");

// Por ahora solo necesitamos obtener tipos de pensión
// Aquí agregarás después las funciones para:
// - Registrar usuario con pensión
// - Registrar vehículos
// - etc.
