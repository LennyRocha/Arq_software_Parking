package utez.edu.mx.backendparking.modules.vehiculo.model;

import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

public class VehiculoResponseDto {

    // ATRIBUTOS
    private Long id;

    private String descripcion;

    private String placa;

    private String modelo;

    private TipoVehiculo tipoVehiculo;

    private Long idUsuario;

    private boolean estatus = true;

    // CONSTRUCTORES
    public VehiculoResponseDto() {
    }

    public VehiculoResponseDto(Long id, String descripcion, String placa, String modelo, TipoVehiculo tipoVehiculo, Long idUsuario, boolean estatus) {
        this.id = id;
        this.descripcion = descripcion;
        this.placa = placa;
        this.modelo = modelo;
        this.tipoVehiculo = tipoVehiculo;
        this.idUsuario = idUsuario;
        this.estatus = estatus;
    }

    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public boolean isEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    // MÉTODO PARA CONVERTIR DESDE ENTIDAD
    public static VehiculoResponseDto fromEntity(Vehiculo vehiculo) {
        return new VehiculoResponseDto(
                vehiculo.getId(),
                vehiculo.getDescripcion(),
                vehiculo.getPlaca(),
                vehiculo.getModelo(),
                vehiculo.getTipoVehiculo(),
                vehiculo.getUsuario() != null ? vehiculo.getUsuario().getId() : null,
                vehiculo.getEstatus()
        );
    }
}
