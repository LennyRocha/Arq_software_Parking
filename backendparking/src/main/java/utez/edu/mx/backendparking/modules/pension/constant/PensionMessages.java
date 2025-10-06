package utez.edu.mx.backendparking.modules.pension.constant;

public class PensionMessages {

    public static final String ERROR_PENSION_DUPLICADA= "¡Pensión duplicada! Ya existe un tipo de pensión con esta duración y costo.";
    public static final String ERROR_PENSION_NOT_FOUND = "Pensión no encontrada.";
    public static final String ERROR_DURACION_MINIMA = "La duración mínima es de 7 días";
    public static final String ERROR_DURACION_MAXIMA = "La duración máxima es de 365 días";
    public static final String ERROR_DURACION_OBLIGATORIA = "La duración en días es obligatoria";
    public static final String ERROR_COSTO_OBLIGATORIO = "El costo es obligatorio";
    public static final String ERROR_COSTO_MAYOR_0 = "El costo debe ser mayor a 0";
}
