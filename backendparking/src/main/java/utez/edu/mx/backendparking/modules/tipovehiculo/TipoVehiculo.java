package utez.edu.mx.backendparking.modules.tipovehiculo;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_vehiculo")
public class TipoVehiculo {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;


    // CONSTRUCTORES
    public TipoVehiculo() {
    }

    public TipoVehiculo(Integer id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public TipoVehiculo(String nombre) {
        this.nombre = nombre;
    }

    // GETTERS Y SETTERS
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
