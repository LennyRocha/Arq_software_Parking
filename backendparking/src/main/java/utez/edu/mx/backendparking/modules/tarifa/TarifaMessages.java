package utez.edu.mx.backendparking.modules.tarifa;

public class TarifaMessages {

    public static final String ERROR_ID_OBLIGATORIO = "El id es obligatorio es obligatorio.";

    // Errores de validación basados en los atributos de la entidad Tarifa
    public static final String ERROR_TIEMPO_OBLIGATORIO = "El tiempo (en minutos) es obligatorio.";
    public static final String ERROR_TIEMPO_MAYOR_15 = "El tiempo debe ser mayor a 15 minutos.";
    public static final String ERROR_TIEMPO_MENOR_1440 = "El tiempo debe ser menor a 1440 minutos (24 horas).";


    public static final String ERROR_PRECIO_OBLIGATORIO = "El costo es obligatorio.";
    public static final String ERROR_PRECIO_MAYOR_0 = "El costo debe ser mayor a 0.";

    public static final String ERROR_TIPO_VEHICULO_OBLIGATORIO = "El tipo de vehículo es obligatorio.";

    // Errores de negocio
    public static final String ERROR_TARIFA_DUPLICADA = "Ya existe una tarifa para este tipo de vehículo y tiempo especificado.";
    public static final String ERROR_TARIFA_NOT_FOUND = "Tarifa no encontrada.";

    // Mensajes de respuesta para endpoints
    public static final String ENDPOINT_TARIFA_POST = "Tarifa agregada correctamente.";
    public static final String ENDPOINT_TARIFA_GET_BY_ID = "Tarifa obtenida correctamente.";
    public static final String ENDPOINT_TARIFA_GET_ALL = "Listado de tarifas obtenido correctamente.";
    public static final String ENDPOINT_TARIFA_GET_ALL_ACTIVE = "Listado de tarifas activas obtenido correctamente.";
    public static final String ENDPOINT_TARIFA_CHANGE_STATUS_ON = "Ha cambiado el estatus de la tarifa de inactivo a activo";
    public static final String ENDPOINT_TARIFA_CHANGE_STATUS_OFF = "Ha cambiado el estatus de la tarifa de activo a inactivo";
    public static final String ENDPOINT_TARIFA_PUT_UPDATE = "Tarifa actualizada correctamente.";
    public static final String ENDPOINT_TARIFA_DELETE = "Tarifa eliminada correctamente.";
}
