package utez.edu.mx.backendparking.modules.usuariopension.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RenovarPensionRequestDto {
    @NotNull
    private Long idPension;

    public RenovarPensionRequestDto() {}

    public RenovarPensionRequestDto(Long idPension) {
        this.idPension = idPension;
    }

    public Long getIdPension() {
        return idPension;
    }

    public void setIdPension(Long idPension) {
        this.idPension = idPension;
    }
}
