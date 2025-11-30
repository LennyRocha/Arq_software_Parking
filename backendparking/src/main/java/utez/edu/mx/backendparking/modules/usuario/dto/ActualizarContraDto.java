package utez.edu.mx.backendparking.modules.usuario.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ActualizarContraDto {
  
    @NotNull(message = "El id no puede ser nulo.")
    private  Long id;
    
    @NotNull(message = "La contraseña no puede ser nula.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String contra;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContra() {
        return contra;
    }
    
    public void setContra(String contra) {
        this.contra = contra;
    }
}
