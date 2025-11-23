package utez.edu.mx.backendparking.modules.usuariopension.dto;

public class VehiculoResponseDto {
    private Long id;
    private String tipoVehiculo;
    private String placa;
    private String modelo;
    private String descripcion;

    public VehiculoResponseDto(Long id, String tipoVehiculo, String placa, String modelo, String descripcion) {
        this.id = id;
        this.tipoVehiculo = tipoVehiculo;
        this.placa = placa;
        this.modelo = modelo;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
