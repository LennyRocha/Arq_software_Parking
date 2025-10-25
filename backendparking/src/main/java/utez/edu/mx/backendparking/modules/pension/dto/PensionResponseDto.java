package utez.edu.mx.backendparking.modules.pension.dto;

public class PensionResponseDto {
    private Long id;
    private String nombre;
    private int duracionDias;
    private Double costo;
    private boolean status;

    public PensionResponseDto() {}

    public PensionResponseDto(Long id, String nombre, int duracionDias, Double costo, boolean status) {
        this.id = id;
        this.nombre = nombre;
        this.duracionDias = duracionDias;
        this.costo = costo;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
