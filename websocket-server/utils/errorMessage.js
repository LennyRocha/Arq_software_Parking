module.exports = getAxiosMessage = (error) => {
    // Detectamos distintos tipos de errores
        let details = {
            message: 'Error desconocido'
        };

        if (error.response) {
            // Error con respuesta del servidor
            details = {
                message: 'Error desde el backend',
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url
            };
        } else if (error.request) {
            // No hubo respuesta
            details = {
                message: 'No hubo respuesta del servidor',
                url: error.config?.url
            };
        } else {
            // Error configurando Axios
            details = {
                message: 'Error en la configuración de la petición',
                error: error.message
            };
        }

        return details;
}