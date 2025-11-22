package utez.edu.mx.backendparking.modules.usuario.Request;

public class UsuarioRequest {
    private String nombre;
    private String correo;
    private String contra;
    private String telefono;
    private String apellidos;
    private String status;
    private boolean esPensionado;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContra() {
        return contra;
    }

    public void setContra(String contra) {
        this.contra = contra;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isEsPensionado() {
        return esPensionado;
    }

    public void setEsPensionado(boolean esPensionado) {
        this.esPensionado = esPensionado;
    }
}
