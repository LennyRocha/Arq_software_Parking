package utez.edu.mx.backendparking.modules.entradasalida.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import utez.edu.mx.backendparking.modules.entradasalida.EntradaSalidaMessages;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

public class EntradaSalidaCreatePensionadoRequestDto {

    // ATRIBUTOS DE RELACION
    @NotBlank(message = EntradaSalidaMessages.ERROR_QR_OBLIGATORIO)
    private String uuidCodigoQR;

    @NotNull(message = EntradaSalidaMessages.ERROR_VEHICULO_OBLIGATORIO)
    private Vehiculo vehiculo;


    // CONSTRUCTORES
    public EntradaSalidaCreatePensionadoRequestDto() {
    }

    public EntradaSalidaCreatePensionadoRequestDto(String uuidCodigoQR, Vehiculo vehiculo) {
        this.uuidCodigoQR = uuidCodigoQR;
        this.vehiculo = vehiculo;
    }


    // GETTERS Y SETTERS

    public String getUuidCodigoQR() {
        return uuidCodigoQR;
    }

    public void setUuidCodigoQR(String uuidCodigoQR) {
        this.uuidCodigoQR = uuidCodigoQR;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }
}
