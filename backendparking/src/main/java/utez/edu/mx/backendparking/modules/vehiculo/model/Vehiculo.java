package utez.edu.mx.backendparking.modules.vehiculo.model;

import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.Usuario;

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

    @Column(unique = true, nullable = true)
    private String placa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;

    @Column(nullable = false)
    private String modelo;

    @Column(nullable = false)
    private boolean estatus;

    @Column(nullable = false)
    private String descripcion;

    public Vehiculo() {
    }

    public Vehiculo(Long id, String modelo, String descripcion, String placa, boolean estatus, TipoVehiculo tVehiculo,
            Usuario usuario) {
        this.modelo = modelo;
        this.descripcion = descripcion;
        this.placa = placa;
        this.estatus = estatus;
        this.tipoVehiculo = tVehiculo;
        this.usuario = usuario;
    }

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

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario user) {
        this.usuario = user;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
