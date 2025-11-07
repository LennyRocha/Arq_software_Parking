package utez.edu.mx.backendparking.modules.tarifa.dto;

import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

public class TarifaResponseDto {

    // ATRIBUTOS
    private Long id;
    private Integer tiempo; // Expresado en minutos
    private Boolean estatus;
    private Double costo;
    private TipoVehiculo tipoVehiculo;

    // CONSTRUCTORES
    public TarifaResponseDto() {
    }

    public TarifaResponseDto(Long id, Integer tiempo, Boolean estatus, Double costo, TipoVehiculo tipoVehiculo) {
        this.id = id;
        this.tiempo = tiempo;
        this.estatus = estatus;
        this.costo = costo;
        this.tipoVehiculo = tipoVehiculo;
    }

    // GETTERS Y SETTERS
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
