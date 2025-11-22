package utez.edu.mx.backendparking.modules.pension;

import jakarta.persistence.*;

@Entity
@Table(name = "pension")
public class Pension {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String nombre;

    @Column(name="duracion_dias", nullable = false)
    private int duracionDias;

    @Column(nullable = false)
    private Double costo;

    @Column(nullable = false)
    private boolean status = true;

    //Constructores
    public Pension() {}

    public Pension(Long id, String nombre, int duracionDias, Double costo, boolean status) {
        this.id = id;
        this.nombre = nombre;
        this.duracionDias = duracionDias;
        this.costo = costo;
        this.status = status;
    }

    //getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
