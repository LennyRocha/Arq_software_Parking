package utez.edu.mx.backendparking.modules.vehiculo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * DTO de respuesta para verificar si el usuario tiene un vehículo estacionado
 */
public class VehiculoEstacionadoResponseDto {

    private boolean tieneVehiculoEstacionado;
    private LocalDate fechaEntrada;
    private LocalTime horaEntrada;
    private String folio;
    private VehiculoDto vehiculo;
    private String mensaje;

    public VehiculoEstacionadoResponseDto() {
    }

    public VehiculoEstacionadoResponseDto(boolean tieneVehiculoEstacionado, LocalDate fechaEntrada, LocalTime horaEntrada, String folio, VehiculoDto vehiculo, String mensaje) {
        this.tieneVehiculoEstacionado = tieneVehiculoEstacionado;
        this.fechaEntrada = fechaEntrada;
        this.horaEntrada = horaEntrada;
        this.folio = folio;
        this.vehiculo = vehiculo;
        this.mensaje = mensaje;
    }

    public boolean isTieneVehiculoEstacionado() {
        return tieneVehiculoEstacionado;
    }

    public void setTieneVehiculoEstacionado(boolean tieneVehiculoEstacionado) {
        this.tieneVehiculoEstacionado = tieneVehiculoEstacionado;
    }

    public LocalDate getFechaEntrada() {
        return fechaEntrada;
    }

    public void setFechaEntrada(LocalDate fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public String getFolio() {
        return folio;
    }

    public void setFolio(String folio) {
        this.folio = folio;
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

