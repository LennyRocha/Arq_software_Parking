const mensajes = {
  400: "Petición incorrecta",
  401: "No autorizado",
  403: "Acceso denegado",
  404: "Recurso no encontrado",
  500: "Error interno del servidor",
};

export function getAxiosErrorMessage(error) {
  // 1️⃣ Timeout
  if (error.code === "ECONNABORTED") {
    return "Se agotó el tiempo de espera para realizar la solicitud";
  }

  // 2️⃣ Error de conexión / sin red
  if (error.message?.toLowerCase().includes("network error")) {
    return "Error de conexión, revisa tu conexión a internet y vuelve a intentarlo";
  }

  // 3️⃣ Error con respuesta del servidor
  if (error.response) {
    // Caso especial: autenticación
    if (error.response?.data?.status === 403) {
      return "Error de autentificación";
    }

    return (
      error.response.data?.message ||
      mensajes[error.response?.status] ||
      `Error del servidor (código ${error.response?.status})`
    );
  }

  // 4️⃣ Petición enviada pero sin respuesta
  if (error.request) {
    return "No se recibió respuesta del servidor";
  }

  // 5️⃣ Cualquier otro error desconocido
  return error.message || "Error desconocido";
}