package utez.edu.mx.backendparking.modules.mercadopago.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PreferenciaRequest {

    @NotNull(message = "El ID de la pensión es requerido")
    private Long pensionId;

    @NotBlank(message = "El correo del usuario es requerido")
    @Email(message = "El formato del correo no es válido")
    private String usuarioEmail;

    @NotBlank(message = "El nombre del usuario es requerido")
    private String usuarioNombre;

    public PreferenciaRequest() {
    }

    public PreferenciaRequest(Long pensionId, String usuarioEmail, String usuarioNombre) {
        this.pensionId = pensionId;
        this.usuarioEmail = usuarioEmail;
        this.usuarioNombre = usuarioNombre;
    }

    // Getters y Setters
    public Long getPensionId() {
        return pensionId;
    }

    public void setPensionId(Long pensionId) {
        this.pensionId = pensionId;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }
}
