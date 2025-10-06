package utez.edu.mx.backendparking.modules.pension.presentation.dto;

public class PensionResponseDto {
    private Long id;
    private int duracionDias;
    private Double costo;
    private boolean status;

    public PensionResponseDto() {}

    public PensionResponseDto(Long id, int duracionDias, Double costo, boolean status) {
        this.id = id;
        this.duracionDias = duracionDias;
        this.costo = costo;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public int getDuracionDias() {
        return duracionDias;
    }

    public Double getCosto() {
        return costo;
    }

    public boolean isStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDuracionDias(int duracionDias) {
        this.duracionDias = duracionDias;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
