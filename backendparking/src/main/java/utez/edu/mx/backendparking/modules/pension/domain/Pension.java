package utez.edu.mx.backendparking.modules.pension.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import utez.edu.mx.backendparking.shared.domain.BaseEntity;

@Entity
@Table(name = "pension")
public class Pension extends BaseEntity {

    @Column(name="duracion_dias", nullable = false)
    private int duracionDias;
    @Column(nullable = false)
    private Double costo;

    //Constructores

    public Pension() {}

    public Pension(int duracionDias, Double costo) {
        this.duracionDias = duracionDias;
        this.costo = costo;
    }
    //getters and setters

    public int getDuracionDias() {
        return duracionDias;
    }

    public void setDuracionDias(int duracionDias) {
        this.duracionDias = duracionDias;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }
}
