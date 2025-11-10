package utez.edu.mx.backendparking.modules.entradasalida.dto;

import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

import java.time.LocalDate;
import java.time.LocalTime;

public class EntradaSalidaResponseDto {

    private Long id;
    private Integer folioTicket;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private Double cantidadPago;
    private LocalDate fecha;
    private Usuario usuario;
    private Vehiculo vehiculo;
    private TipoVehiculo tipoVehiculo;

    // CONSTRUCTORES
    public EntradaSalidaResponseDto() {
    }

    public EntradaSalidaResponseDto(Long id, Integer folioTicket, LocalTime horaEntrada, LocalTime horaSalida, Double cantidadPago, LocalDate fecha, Usuario usuario, Vehiculo vehiculo, TipoVehiculo tipoVehiculo) {
        this.id = id;
        this.folioTicket = folioTicket;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.cantidadPago = cantidadPago;
        this.fecha = fecha;
        this.usuario = usuario;
        this.vehiculo = vehiculo;
        this.tipoVehiculo = tipoVehiculo;
    }

    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getFolioTicket() {
        return folioTicket;
    }

    public void setFolioTicket(Integer folioTicket) {
        this.folioTicket = folioTicket;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Double getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
