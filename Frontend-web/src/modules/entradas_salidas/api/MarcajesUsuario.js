import apiToken from "../../../utils/api";

/**
 * Verificar si el pensionado tiene un vehículo estacionado actualmente
 * @returns {Promise} - Respuesta con los datos del vehículo estacionado si existe
 */
export const verificarVehiculoEstacionado = () => {
  return apiToken.get("/api/vehiculos/estacionado/verificar");
};

/**
 * Obtener todos los vehículos del pensionado autenticado
 * @returns {Promise} - Respuesta con la lista de vehículos del pensionado
 */
export const fetchVehiculosDePensionado = () => {
  return apiToken.get("/api/vehiculos/mis-vehiculos");
};

/**
 * Marcar la entrada de un vehículo del pensionado
 * @param {number} vehiculoId - ID del vehículo a estacionar
 * @returns {Promise} - Respuesta con los datos de la entrada registrada
 */
export const marcarEntradaVehiculo = (vehiculoId) => {
  return apiToken.post("/api/entrada-salida/pensionado", { vehiculoId });
};

/**
 * Marcar la salida del vehículo estacionado del pensionado
 * @returns {Promise} - Respuesta con los datos de la salida registrada
 */
export const marcarSalidaVehiculo = () => {
  return apiToken.put("/api/entrada-salida/pensionado/salida");
};

/**
 * Solicita el código para marcar una entrada o salida del estacionamiento
 * @returns {Promise} - Respuesta con el codigo de identificación para generar el qr
 */
export const solicitarCodigoEntradaSalida = () => {
  return apiToken.get("/api/entrada-salida/solicitar-codigo");
};