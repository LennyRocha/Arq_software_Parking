package utez.edu.mx.backendparking.modules.entradasalida;

public class EntradaSalidaMessages {

    public static final String ERROR_ID_OBLIGATORIO = "El id es obligatorio.";

    // Errores de validación basados en los atributos de la entidad EntradaSalida
    public static final String ERROR_FOLIO_TICKET_OBLIGATORIO = "El folio del ticket es obligatorio.";
    public static final String ERROR_QR_OBLIGATORIO = "El codigo QR es obligatorio es obligatorio.";
    public static final String ERROR_FOLIO_TICKET_MAYOR_0 = "El folio del ticket debe ser mayor a 0.";

    public static final String ERROR_HORA_ENTRADA_OBLIGATORIA = "La hora de entrada es obligatoria.";
    public static final String ERROR_HORA_SALIDA_INVALIDA = "La hora de salida no puede ser anterior a la hora de entrada.";

    public static final String ERROR_CANTIDAD_PAGO_MAYOR_0 = "La cantidad de pago debe ser mayor a 0.";

    public static final String ERROR_FECHA_OBLIGATORIA = "La fecha es obligatoria.";

    public static final String ERROR_USUARIO_OBLIGATORIO = "El usuario es obligatorio.";
    public static final String ERROR_VEHICULO_OBLIGATORIO = "El vehículo es obligatorio.";
    public static final String ERROR_TIPO_VEHICULO_OBLIGATORIO = "El tipo de vehículo es obligatorio.";

    // Errores de negocio
    public static final String ERROR_ENTRADA_SALIDA_DUPLICADA = "Ya existe un registro con este folio de ticket.";
    public static final String ERROR_ENTRADA_SALIDA_NOT_FOUND = "Registro de entrada/salida no encontrado.";
    public static final String ERROR_VEHICULO_YA_EN_ESTACIONAMIENTO = "El vehículo ya se encuentra en el estacionamiento.";
    public static final String ERROR_VEHICULO_NO_EN_ESTACIONAMIENTO = "El vehículo no se encuentra registrado en el estacionamiento.";
    public static final String ERROR_VEHICULO_NO_ENCONTRADO = "El vehículo especificado no fue encontrado.";
    public static final String ERROR_VEHICULO_NO_PERTENECE_USUARIO = "El vehículo no pertenece al usuario especificado.";
    public static final String ERROR_FOLIO_ES_PENSIONADO = "Este folio corresponde a un pensionado, no a un visitante.";
    public static final String ERROR_SALIDA_YA_REGISTRADA = "Este folio ya tiene una salida registrada.";
    public static final String ERROR_SOLO_ACTUALIZAR_VISITANTES = "Solo se pueden actualizar registros de visitantes.";
    public static final String ERROR_TARIFA_NO_ENCONTRADA = "No se encontraron tarifas activas para el tipo de vehículo.";
    public static final String ERROR_USUARIO_SIN_PENSION_ACTIVA = "El usuario no tiene una pensión activa.";

    // Mensajes de respuesta para endpoints
    public static final String ENDPOINT_ENTRADA_SALIDA_POST = "Registro de entrada creado correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_POST_PENSIONADO = "Registro de entrada para pensionado creado correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_GET_BY_ID = "Registro de entrada/salida obtenido correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_GET_ALL = "Listado de registros de entrada/salida obtenido correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_REGISTRAR_SALIDA = "Salida registrada correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_SALIDA_DATOS= "Datos de salida obtenidos correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_PUT_UPDATE = "Registro de entrada/salida actualizado correctamente.";
    public static final String ENDPOINT_ENTRADA_SALIDA_DELETE = "Registro de entrada/salida eliminado correctamente.";
    public static final String ENDPOINT_REPORTE_GANANCIAS_POR_HORA = "Reporte de ganancias por hora generado correctamente.";
}
