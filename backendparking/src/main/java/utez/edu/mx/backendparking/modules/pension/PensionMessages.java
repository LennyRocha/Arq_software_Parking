package utez.edu.mx.backendparking.modules.pension;

public class PensionMessages {

    public static final String ERROR_NOMBRE_PENSION_VACIO="El nombre de la pensión no puede estar vacío.";
    public static final String ERROR_NOMBRE_PENSION_LONGITUD="El nombre de la pensión debe tener entre 3 y 50 caracteres.";
    public static final String ERROR_PENSION_DUPLICADA= "Ya existe un tipo de pensión con esta duración y costo.";
    public static final String ERROR_PENSION_NOT_FOUND = "Pensión no encontrada.";
    public static final String ERROR_DURACION_MINIMA = "La duración mínima es de 7 días";
    public static final String ERROR_DURACION_MAXIMA = "La duración máxima es de 365 días";
    public static final String ERROR_DURACION_OBLIGATORIA = "La duración en días es obligatoria";
    public static final String ERROR_COSTO_OBLIGATORIO = "El costo es obligatorio";
    public static final String ERROR_COSTO_MAYOR_0 = "El costo debe ser mayor a 0";

    public static final String ENDPOINT_TIPOPENSION_POST="Tipo de pensión agregado correctamente.";
    public static final String ENDPOINT_TIPOPENSION_GET_ALL="Listado de pensiones obtenido correctamente.";
    public static final String ENDPOINT_TIPOPENSION_PUT_CHANGE_STATUS="Estado de la pensión actualizado correctamente.";
}
