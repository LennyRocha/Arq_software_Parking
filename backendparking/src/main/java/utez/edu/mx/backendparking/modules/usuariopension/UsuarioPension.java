package utez.edu.mx.backendparking.modules.usuariopension;


import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.entradasalida.EntradaSalida;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;

import java.time.LocalDate;

@Entity
@Table(name = "pension")
public class UsuarioPension {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean estatus = true;

    @Column(name= "fecha_finalizacion", nullable = false)
    private LocalDate fechaFinalizacion;

    @Column(name= "uuid_codigo_qr", nullable = false)
    private String uuidCodigoQR;

    @Column(nullable = false)
    private Long idUltimaEntrada;

    // ATRIBUTOS DE RELACION
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_pension", referencedColumnName = "id")
    private Pension pension;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ultima_entrada", referencedColumnName = "id")
    private EntradaSalida ultimaEntradaSalida;


    // CONSTRUCTORES
    public UsuarioPension() {
    }

    public UsuarioPension(boolean estatus, LocalDate fechaFinalizacion, String uuidCodigoQR, Long idUltimaEntrada, Usuario usuario, Pension pension, EntradaSalida ultimaEntradaSalida) {
        this.estatus = estatus;
        this.fechaFinalizacion = fechaFinalizacion;
        this.uuidCodigoQR = uuidCodigoQR;
        this.idUltimaEntrada = idUltimaEntrada;
        this.usuario = usuario;
        this.pension = pension;
        this.ultimaEntradaSalida = ultimaEntradaSalida;
    }

    public UsuarioPension(Long id, boolean estatus, LocalDate fechaFinalizacion, String uuidCodigoQR, Long idUltimaEntrada, Usuario usuario, Pension pension, EntradaSalida ultimaEntradaSalida) {
        this.id = id;
        this.estatus = estatus;
        this.fechaFinalizacion = fechaFinalizacion;
        this.uuidCodigoQR = uuidCodigoQR;
        this.idUltimaEntrada = idUltimaEntrada;
        this.usuario = usuario;
        this.pension = pension;
        this.ultimaEntradaSalida = ultimaEntradaSalida;
    }


    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    public LocalDate getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalDate fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public Long getIdUltimaEntrada() {
        return idUltimaEntrada;
    }

    public void setIdUltimaEntrada(Long idUltimaEntrada) {
        this.idUltimaEntrada = idUltimaEntrada;
    }

    public String getUuidCodigoQR() {
        return uuidCodigoQR;
    }

    public void setUuidCodigoQR(String uuidCodigoQR) {
        this.uuidCodigoQR = uuidCodigoQR;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Pension getPension() {
        return pension;
    }

    public void setPension(Pension pension) {
        this.pension = pension;
    }

    public EntradaSalida getUltimaEntradaSalida() {
        return ultimaEntradaSalida;
    }

    public void setUltimaEntradaSalida(EntradaSalida ultimaEntradaSalida) {
        this.ultimaEntradaSalida = ultimaEntradaSalida;
    }
}
