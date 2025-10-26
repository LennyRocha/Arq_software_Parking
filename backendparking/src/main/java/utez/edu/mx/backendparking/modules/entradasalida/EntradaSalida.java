package utez.edu.mx.backendparking.modules.entradasalida;

import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.vehiculo.Vehiculo;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "entrada_salida")
public class EntradaSalida {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "folio_ticket", nullable = false)
    private Integer folioTicket;

    @Column(name= "hora_entrada", nullable = false)
    private LocalTime horaEntrada;

    @Column(name= "hora_salida")
    private LocalTime horaSalida;

    @Column(name= "cantidad_pago")
    private Double cantidadPago;

    @Column(name= "fecha", nullable = false)
    private LocalDate fecha;

    // ATRIBUTOS DE RELACION
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_vehiculo", referencedColumnName = "id")
    private Vehiculo vehiculo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_vehiculo", referencedColumnName = "id", nullable = false)
    private TipoVehiculo tipoVehiculo;


    // CONSTRUCTORES
    public EntradaSalida() {
    }

    public EntradaSalida(Long id, Integer folioTicket, LocalTime horaEntrada, LocalTime horaSalida, Double cantidadPago, LocalDate fecha, Usuario usuario, Vehiculo vehiculo, TipoVehiculo tipoVehiculo) {
        this.id = id;
        this.folioTicket = folioTicket;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.cantidadPago = cantidadPago;
        this.fecha = fecha;
        this.usuario = usuario;
        this.vehiculo = vehiculo;
        this.tipoVehiculo = tipoVehiculo;
    }


    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getFolioTicket() {
        return folioTicket;
    }

    public void setFolioTicket(Integer folioTicket) {
        this.folioTicket = folioTicket;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Double getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
