import apiToken from "../../../utils/api";

// ============= TIPOS DE PENSIÓN =============

// Obtener tipos de pensión paginados
export const fetchTiposPensionPaginados = ({
  page = 0,
  size = 10,
  sort = "id,desc",
}) => {
  return apiToken.get("/api/pension/public/paginados", {
    params: { page, size, sort },
  });
};

// ============= TIPOS DE VEHÍCULO =============

// Obtener todos los tipos de vehículo
export const fetchTiposVehiculo = () => 
  apiToken.get("/api/vehiculos/tipos");

// ============= REGISTRO DE PENSIONADO =============

// Registrar pensionado con pensión y vehículos
export const registrarPensionado = (data) => 
  apiToken.post("/api/pensionado/public/registro", data);

// ============= MERCADO PAGO =============

// Crear preferencia de pago en Mercado Pago
export const crearPreferenciaPago = (data) =>
  apiToken.post("/api/mercadopago/crear-preferencia", {
    pensionId: data.pensionId,
    usuarioEmail: data.correo,
    usuarioNombre: `${data.nombre} ${data.apellidos}`,
  });

