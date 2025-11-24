package utez.edu.mx.backendparking.modules.usuariopension.dto;

import java.time.LocalDate;

public class UsuarioPensionResponseDto {
    private Long id;
    private String correo;
    private String nombrePension;
    private LocalDate fechaFinalizacion;
    private Double costoUltimoPago;
    private boolean estatus;
    private String uuidCodigoQR;

    public UsuarioPensionResponseDto() {}

    public UsuarioPensionResponseDto(Long id, String correo, String nombrePension, LocalDate fechaFinalizacion, Double costoUltimoPago, boolean estatus, String uuidCodigoQR) {
        this.id = id;
        this.correo = correo;
        this.nombrePension = nombrePension;
        this.fechaFinalizacion = fechaFinalizacion;
        this.costoUltimoPago = costoUltimoPago;
        this.estatus = estatus;
        this.uuidCodigoQR = uuidCodigoQR;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getNombrePension() {
        return nombrePension;
    }

    public void setNombrePension(String nombrePension) {
        this.nombrePension = nombrePension;
    }

    public LocalDate getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalDate fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public Double getCostoUltimoPago() {
        return costoUltimoPago;
    }

    public void setCostoUltimoPago(Double costoUltimoPago) {
        this.costoUltimoPago = costoUltimoPago;
    }

    public boolean isEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    public String getUuidCodigoQR() {
        return uuidCodigoQR;
    }

    public void setUuidCodigoQR(String uuidCodigoQR) {
        this.uuidCodigoQR = uuidCodigoQR;
    }
}
