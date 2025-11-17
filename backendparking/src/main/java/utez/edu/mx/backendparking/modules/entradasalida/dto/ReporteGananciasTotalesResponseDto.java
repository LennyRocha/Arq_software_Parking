package utez.edu.mx.backendparking.modules.entradasalida.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReporteGananciasTotalesResponseDto {

    // ATRIBUTOS
    private LocalDate fechaInicial;
    private LocalDate fechaFinal;
    private Double gananciasPensionados;
    private Double gananciasVisitantes;
    private Double gananciasTotales;


    // CONSTRUCTORES
    public ReporteGananciasTotalesResponseDto() {
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
