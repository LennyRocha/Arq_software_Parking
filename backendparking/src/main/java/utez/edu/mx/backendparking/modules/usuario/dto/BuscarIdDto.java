package utez.edu.mx.backendparking.modules.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class BuscarIdDto {
    @Email(message = "El correo debe tener un formato válido.")
    @NotNull(message = "El correo no puede ser nulo.")
    private String correo;

    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }

}
