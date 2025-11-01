package utez.edu.mx.backendparking.modules.entradasalida.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReporteGananciasResponseDto {

    // ATRIBUTOS
    private LocalDate fechaInicial;
    private LocalDate fechaFinal;
    private LocalTime hora;
    private Double gananciasPensionados;
    private Double gananciasVisitantes;
    private Double gananciasTotales;

    // CONSTRUCTORES
    public ReporteGananciasResponseDto() {
    }

    public ReporteGananciasResponseDto(LocalDate fechaInicial, LocalDate fechaFinal, LocalTime hora, Double gananciasPensionados, Double gananciasVisitantes, Double gananciasTotales) {
        this.fechaInicial = fechaInicial;
        this.fechaFinal = fechaFinal;
        this.hora = hora;
        this.gananciasPensionados = gananciasPensionados;
        this.gananciasVisitantes = gananciasVisitantes;
        this.gananciasTotales = gananciasTotales;
    }


    // GETTERS Y SETTERS


    public LocalDate getFechaInicial() {
        return fechaInicial;
    }

    public void setFechaInicial(LocalDate fechaInicial) {
        this.fechaInicial = fechaInicial;
    }

    public LocalDate getFechaFinal() {
        return fechaFinal;
    }

    public void setFechaFinal(LocalDate fechaFinal) {
        this.fechaFinal = fechaFinal;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public Double getGananciasPensionados() {
        return gananciasPensionados;
    }

    public void setGananciasPensionados(Double gananciasPensionados) {
        this.gananciasPensionados = gananciasPensionados;
    }

    public Double getGananciasVisitantes() {
        return gananciasVisitantes;
    }

    public void setGananciasVisitantes(Double gananciasVisitantes) {
        this.gananciasVisitantes = gananciasVisitantes;
    }

    public Double getGananciasTotales() {
        return gananciasTotales;
    }

    public void setGananciasTotales(Double gananciasTotales) {
        this.gananciasTotales = gananciasTotales;
    }
}
