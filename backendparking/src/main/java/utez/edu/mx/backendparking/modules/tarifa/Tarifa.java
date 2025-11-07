package utez.edu.mx.backendparking.modules.tarifa;

import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

@Entity
@Table(name = "tarifa")
public class Tarifa {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer tiempo; // Expresado en minutos

    @Column(nullable = false)
    private Boolean estatus;

    @Column(nullable = false)
    private Double costo;

    // ATRIBUTOS DE RELACION
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_vehiculo", referencedColumnName = "id", nullable = false)
    private TipoVehiculo tipoVehiculo;


    // CONSTRUCTORES
    public Tarifa() {
    }

    public Tarifa(Long id, Integer tiempo, Boolean estatus, Double costo, TipoVehiculo tipoVehiculo) {
        this.id = id;
        this.tiempo = tiempo;
        this.estatus = estatus;
        this.costo = costo;
        this.tipoVehiculo = tipoVehiculo;
    }


    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTiempo() {
        return tiempo;
    }

    public void setTiempo(Integer tiempo) {
        this.tiempo = tiempo;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
