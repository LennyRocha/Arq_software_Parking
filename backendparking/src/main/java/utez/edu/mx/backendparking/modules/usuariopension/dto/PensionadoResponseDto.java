package utez.edu.mx.backendparking.modules.usuariopension.dto;

import java.time.LocalDate;
import java.util.List;

public class PensionadoResponseDto {
    private Long usuarioId;
    private String nombreCompleto;
    private String correo;
    private String telefono;
    private Long usuarioPensionId;
    private LocalDate fechaFinalizacion;
    private String uuidCodigoQR;
    private List<VehiculoResponseDto> vehiculos;
    private Long pagoId;
    private Double cantidadPago;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Long getUsuarioPensionId() {
        return usuarioPensionId;
    }

    public void setUsuarioPensionId(Long usuarioPensionId) {
        this.usuarioPensionId = usuarioPensionId;
    }

    public LocalDate getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalDate fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public String getUuidCodigoQR() {
        return uuidCodigoQR;
    }

    public void setUuidCodigoQR(String uuidCodigoQR) {
        this.uuidCodigoQR = uuidCodigoQR;
    }

    public Long getPagoId() {
        return pagoId;
    }

    public void setPagoId(Long pagoId) {
        this.pagoId = pagoId;
    }

    public List<VehiculoResponseDto> getVehiculos() {
        return vehiculos;
    }

    public void setVehiculos(List<VehiculoResponseDto> vehiculos) {
        this.vehiculos = vehiculos;
    }

    public Double getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }
}
