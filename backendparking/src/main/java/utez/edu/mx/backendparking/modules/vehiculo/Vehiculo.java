package utez.edu.mx.backendparking.modules.vehiculo;

import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;

@Entity
@Table(name = "vehiculo")
public class Vehiculo {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_vehiculo", referencedColumnName = "id", nullable = false)
    private TipoVehiculo tipoVehiculo;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
