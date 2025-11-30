import apiToken from "../../../utils/apiToken";


// Obtener una entrada-salida por ID
export const fetchEntradaSalidaByID = (id) => apiToken.get(`/api/entrada-salida/get-by-id/${id}`);

// Crear una nueva entrada-salida para el visitante
export const createEntradaSalidaVisitante = (entrada) => apiToken.post("/api/entrada-salida/visitante", entrada);

// Obtener datos de entrada-salida de un visitante antes de pagar
export const fetchEntradaSalidaCostoFinal = (folioTicket) => apiToken.get(`/api/entrada-salida/visitante/salida-datos/${folioTicket}`);

// Realizar el pago de una entrada-salida como visitante 
export const updateEntradaSalidaPagar = (folioTicket) => apiToken.put(`/api/entrada-salida/visitante/salida/${folioTicket}`);

// Actualizar los datos de una entrada/salida de un visitante
export const updateEntradaSalida = (id, entrada) => apiToken.put(`/api/entrada-salida/actualizar-datos/${id}`, entrada);


// Buscar entradas-salidas con filtros, ordenamiento y paginación, para admins y empleados
export const searchEntradasSalidasPaginated = ({
  search = null,
  sortBy = "fecha",
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

  return apiToken.get("/api/entrada-salida/search/paginated", { params });
};

// Buscar entradas-salidas con filtros, ordenamiento y paginación, solo para pensionados
export const searchEntradasSalidasPensionadoPaginated = ({
  search = null,
  sortBy = "fecha",
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

  return apiToken.get("/api/entrada-salida/pensionado/search/paginated", { params });
};

// Obtener todos los tipos de vehiculos
export const fetchTiposVehiculos = () => apiToken.get("/api/vehiculos/tipos");