package utez.edu.mx.backendparking.modules.usuario.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    @Size(min = 3, max = 50, message = "El correo debe tener entre 3 y 50 caracteres.")
    @NotNull(message = "El correo no puede ser nulo.")
     private String correo;
     @Size(min = 4, max = 20, message = "La contraseña debe tener entre 4 y 20 caracteres.")
     @NotNull(message = "La contraseña no puede ser nulo.")
    private String contra;

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
}
