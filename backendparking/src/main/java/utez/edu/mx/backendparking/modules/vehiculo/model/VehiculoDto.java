package utez.edu.mx.backendparking.modules.vehiculo.model;

import jakarta.validation.constraints.*;

public class VehiculoDto {

    private Long id;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 250, message = "La descripción no debe tener más de 250 caracteres")
    private String descripcion;

    @Size(max = 7, message = "La placa no debe tener más de 7 caracteres")
    @Pattern(regexp = "^$|^[A-Za-z0-9-]+$", message = "La placa solo puede contener letras, números y guiones")
    private String placa;

    @NotBlank(message = "El modelo es obligatorio")
    @Size(max = 50, message = "El modelo del vehículo no debe tener más de 50 caracteres")
    private String modelo;

    @NotNull(message = "El tipo de vehículo es obligatorio")
    private Integer idTipoVehiculo;

    @NotNull(message = "El usuario es obligatorio")
    private Long idUsuario;

    private boolean estatus = true;

    // Getters y setters (muy importantes para que Spring los lea)
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

    public Integer getIdTipoVehiculo() {
        return idTipoVehiculo;
    }

    public void setIdTipoVehiculo(Integer idTipoVehiculo) {
        this.idTipoVehiculo = idTipoVehiculo;
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

    public Vehiculo toEntity() {
        Vehiculo vehiculo = new Vehiculo();
        if (id != null) {
            vehiculo.setId(id);
        }
        vehiculo.setModelo(modelo);
        vehiculo.setPlaca(placa);
        vehiculo.setEstatus(estatus);
        vehiculo.setTipoVehiculo(null);
        vehiculo.setUsuario(null);
        return vehiculo;
    }

    public static VehiculoDto fromEntity(Vehiculo vehiculo) {
        if (vehiculo == null) {
            return null;
        }
        VehiculoDto vDto = new VehiculoDto();
        vDto.setId(vehiculo.getId());
        vDto.setModelo(vehiculo.getModelo());
        vDto.setDescripcion(vehiculo.getDescripcion());
        vDto.setPlaca(vehiculo.getPlaca());
        vDto.setEstatus(vehiculo.getEstatus());
        vDto.setIdTipoVehiculo(vehiculo.getTipoVehiculo().getId());
        vDto.setIdUsuario(vehiculo.getUsuario().getId());
        return vDto;
    }
}
