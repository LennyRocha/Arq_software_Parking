package utez.edu.mx.backendparking.modules.pension.presentation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import utez.edu.mx.backendparking.modules.pension.constant.PensionMessages;

public class PensionRequestDto {

    @Min(value = 7, message = PensionMessages.ERROR_DURACION_MINIMA)
    @Max(value = 365, message = PensionMessages.ERROR_DURACION_MAXIMA)
    @NotNull(message = PensionMessages.ERROR_DURACION_OBLIGATORIA)
    private int duracionDias;

    @DecimalMin(value = "1.00", message = PensionMessages.ERROR_COSTO_MAYOR_0)
    @NotNull(message = PensionMessages.ERROR_COSTO_OBLIGATORIO)
    private Double costo;

    public PensionRequestDto() {}

    public PensionRequestDto(int duracionDias, Double costo) {
        this.duracionDias = duracionDias;
        this.costo = costo;
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
