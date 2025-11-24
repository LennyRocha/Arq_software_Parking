package utez.edu.mx.backendparking.modules.historialpagos.dto;

import java.time.LocalDate;

public class PagoResponseDto {
    private Long id;
    private Double cantidadPago;
    private LocalDate fechaPago;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public PagoResponseDto() {}

    public PagoResponseDto(Long id, Double cantidadPago, LocalDate fechaPago, LocalDate fechaInicio, LocalDate fechaFin) {
        this.id = id;
        this.cantidadPago = cantidadPago;
        this.fechaPago = fechaPago;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}
