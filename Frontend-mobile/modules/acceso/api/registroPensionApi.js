import api from '../../../utils/api'

// ============= TIPOS DE PENSIÓN =============

// Obtener tipos de pensión paginados
export const fetchTiposPensionPaginados = ({
  page = 0,
  size = 10,
  sort = "id,desc",
}) => {
  return api.get("/pension/public/activas/paginados", {
    params: { page, size, sort },
  });
};

// ============= TIPOS DE VEHÍCULO =============

// Obtener todos los tipos de vehículo
export const fetchTiposVehiculo = () => 
  api.get("/vehiculos/tipos");

// ============= REGISTRO DE PENSIONADO =============

// Registrar pensionado con pensión y vehículos
export const registrarPensionado = (data) => 
  api.post("/pensionado/public/registro", data);

// ============= MERCADO PAGO =============

// Crear preferencia de pago en Mercado Pago
export const crearPreferenciaPago = (data) =>
  api.post("/mercadopago/crear-preferencia", {
    pensionId: data.pensionId,
    usuarioEmail: data.correo,
    usuarioNombre: `${data.nombre} ${data.apellidos}`,
  });

