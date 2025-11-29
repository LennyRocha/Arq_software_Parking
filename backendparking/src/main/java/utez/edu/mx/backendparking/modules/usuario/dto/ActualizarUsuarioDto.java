package utez.edu.mx.backendparking.modules.usuario.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ActualizarUsuarioDto {
    @NotNull(message = "El id no puede ser nulo.")
    private Long id;
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 25 caracteres.")
    @NotNull(message = "El nombre no puede ser nulo.")
    private String nombre;
   @Size(min = 5, max = 100, message = "El correo debe tener entre 5 y 25 caracteres.")
    @NotNull(message = "El correo no puede ser nulo.")
    private String correo;
    @Size(min = 3, max = 100, message = "Los apellidos deben tener entre 3 y 25 caracteres.")
    @NotNull(message = "Los apellidos no pueden ser nulos.")
    private String apellidos;
    @Size(min = 10, max = 15, message = "El teléfono debe tener entre 10 y 15 caracteres.")
    @NotNull(message = "El teléfono no puede ser nulo.")
    private String telefono;

    public Long getId() {
        return id;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
}
