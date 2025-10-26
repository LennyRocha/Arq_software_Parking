package utez.edu.mx.backendparking.modules.pension.dto;

import jakarta.validation.constraints.*;
import utez.edu.mx.backendparking.modules.pension.PensionMessages;

public class PensionRequestDto {

    @NotBlank(message = PensionMessages.ERROR_NOMBRE_PENSION_VACIO)
    @Size(min = 3, max = 50,message = PensionMessages.ERROR_NOMBRE_PENSION_LONGITUD) //  Mínimo y máximo
    private String nombre;

    @Min(value = 7, message = PensionMessages.ERROR_DURACION_MINIMA)
    @Max(value = 365, message = PensionMessages.ERROR_DURACION_MAXIMA)
    @NotNull(message = PensionMessages.ERROR_DURACION_OBLIGATORIA)
    private int duracionDias;

    @DecimalMin(value = "1.00", message = PensionMessages.ERROR_COSTO_MAYOR_0)
    @NotNull(message = PensionMessages.ERROR_COSTO_OBLIGATORIO)
    private Double costo;

    public PensionRequestDto() {}

    public PensionRequestDto(String nombre, int duracionDias, Double costo) {
        this.nombre = nombre;
        this.duracionDias = duracionDias;
        this.costo = costo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getDuracionDias() {
        return duracionDias;
    }

    public void setDuracionDias(int duracionDias) {
        this.duracionDias = duracionDias;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }
}
