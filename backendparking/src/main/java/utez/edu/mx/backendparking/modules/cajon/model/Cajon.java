package utez.edu.mx.backendparking.modules.cajon.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

@Entity
@Table(name = "cajon")
public class Cajon
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, name = "identificador")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_vehiculo", referencedColumnName = "id", nullable = false)
    private TipoVehiculo tipoVehiculo;

    @Column(nullable = false)
    private String ubicacion;

    @Column(nullable = false)
    private Boolean disponible;

    @Column(nullable = false, name = "para_pensionados")
    private Boolean paraPensionados;

    @Column (nullable = false)
    private int piso;

    @Column(nullable = false)
    private boolean estatus;

    public Cajon(){}

    public Cajon(Long id, String name, String ubicacion, Boolean disponible, Boolean paraPensionados, int piso, Boolean estatus, TipoVehiculo tipoVehiculo){
        this.id = id;
        this.name = name;
        this.ubicacion = ubicacion;
        this.disponible = disponible;
        this.paraPensionados = paraPensionados;
        this.piso = piso;
        this.estatus = estatus;
        this.tipoVehiculo = tipoVehiculo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public int getPiso() {
        return piso;
    }

    public void setPiso(int piso) {
        this.piso = piso;
    }

    public Boolean getParaPensionados() {
        return paraPensionados;
    }

    public void setParaPensionados(Boolean paraPensionados) {
        this.paraPensionados = paraPensionados;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TipoVehiculo getTipoVehiculo(){
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo){
        this.tipoVehiculo = tipoVehiculo;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
