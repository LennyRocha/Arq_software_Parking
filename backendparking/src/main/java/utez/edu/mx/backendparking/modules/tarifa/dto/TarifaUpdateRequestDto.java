package utez.edu.mx.backendparking.modules.tarifa.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;

public class TarifaUpdateRequestDto {


    // ATRIBUTOS
    @NotNull(message = TarifaMessages.ERROR_ID_OBLIGATORIO)
    private Long id;

    @Min(value = 15, message = TarifaMessages.ERROR_TIEMPO_MAYOR_15)
    @Max(value = 1440, message = TarifaMessages.ERROR_TIEMPO_MENOR_1440)
    private Integer tiempo; // Expresado en minutos

    private Boolean estatus = true;

    @DecimalMin(value = "1.00", message = TarifaMessages.ERROR_PRECIO_MAYOR_0)
    private Double costo;

    // ATRIBUTOS DE RELACION
    private TipoVehiculo tipoVehiculo;


    public TarifaUpdateRequestDto() {
    }

    public TarifaUpdateRequestDto(Long id, Integer tiempo, Boolean estatus, Double costo, TipoVehiculo tipoVehiculo) {
        this.id = id;
        this.tiempo = tiempo;
        this.estatus = estatus;
        this.costo = costo;
        this.tipoVehiculo = tipoVehiculo;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
