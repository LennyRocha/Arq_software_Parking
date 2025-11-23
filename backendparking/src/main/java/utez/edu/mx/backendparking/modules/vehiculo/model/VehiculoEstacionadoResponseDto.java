package utez.edu.mx.backendparking.modules.vehiculo.model;

/**
 * DTO de respuesta para verificar si el usuario tiene un vehículo estacionado
 */
public class VehiculoEstacionadoResponseDto {

    private boolean tieneVehiculoEstacionado;
    private VehiculoDto vehiculo;
    private String mensaje;

    public VehiculoEstacionadoResponseDto() {
    }

    public VehiculoEstacionadoResponseDto(boolean tieneVehiculoEstacionado, VehiculoDto vehiculo, String mensaje) {
        this.tieneVehiculoEstacionado = tieneVehiculoEstacionado;
        this.vehiculo = vehiculo;
        this.mensaje = mensaje;
    }

    public boolean isTieneVehiculoEstacionado() {
        return tieneVehiculoEstacionado;
    }

    public void setTieneVehiculoEstacionado(boolean tieneVehiculoEstacionado) {
        this.tieneVehiculoEstacionado = tieneVehiculoEstacionado;
    }

    public VehiculoDto getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(VehiculoDto vehiculo) {
        this.vehiculo = vehiculo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}

