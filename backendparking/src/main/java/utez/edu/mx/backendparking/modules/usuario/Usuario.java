package utez.edu.mx.backendparking.modules.usuario;

import utez.edu.mx.backendparking.modules.roles.Roles;
import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false)
    private String contra;

    @Column(nullable = false)
    private boolean status;

    @Column(nullable = false)
    private boolean esPensionado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Roles rol;

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

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContra() {
        return contra;
    }

    public void setContra(String contra) {
        this.contra = contra;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public boolean isEsPensionado() {
        return esPensionado;
    }

    public void setEsPensionado(boolean esPensionado) {
        this.esPensionado = esPensionado;
    }

    public Roles getRol() {
        return rol;
    }

    public void setRol(Roles rol) {
        this.rol = rol;
    }

    public Usuario(Long id, String nombre, String apellidos, String correo, String telefono, String contra, boolean status, boolean esPensionado, Roles rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.telefono = telefono;
        this.contra = contra;
        this.status = status;
        this.esPensionado = esPensionado;
        this.rol = rol;
    }

    public Usuario() {
    }
}
