package utez.edu.mx.backendparking.modules.tarifa.dto;

import jakarta.validation.constraints.*;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

public class TarifaRequestDto {

    // ATRIBUTOS
    @Min(value = 15, message = TarifaMessages.ERROR_TIEMPO_MAYOR_15)
    @Max(value = 1440, message = TarifaMessages.ERROR_TIEMPO_MENOR_1440)
    @NotNull(message = TarifaMessages.ERROR_TIEMPO_OBLIGATORIO)
    private Integer tiempo; // Expresado en minutos

    private Boolean estatus = true;

    @DecimalMin(value = "1.00", message = TarifaMessages.ERROR_PRECIO_MAYOR_0)
    @NotNull(message = TarifaMessages.ERROR_PRECIO_OBLIGATORIO)
    private Double costo;

    // ATRIBUTOS DE RELACION
    @NotNull(message = TarifaMessages.ERROR_TIPO_VEHICULO_OBLIGATORIO)
    private TipoVehiculo tipoVehiculo;


    public TarifaRequestDto() {
    }

    public TarifaRequestDto(Integer tiempo, Boolean estatus, Double costo, TipoVehiculo tipoVehiculo) {
        this.tiempo = tiempo;
        this.estatus = estatus;
        this.costo = costo;
        this.tipoVehiculo = tipoVehiculo;
    }

    public Integer getTiempo() {
        return tiempo;
    }

    public void setTiempo(Integer tiempo) {
        this.tiempo = tiempo;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
