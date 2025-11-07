package utez.edu.mx.backendparking.modules.entradasalida.dto;

import jakarta.validation.constraints.NotNull;
import utez.edu.mx.backendparking.modules.entradasalida.EntradaSalidaMessages;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

public class EntradaSalidaCreateVisitanteRequestDto {

    // ATRIBUTOS DE RELACION
    private Vehiculo vehiculo;

    @NotNull(message = EntradaSalidaMessages.ERROR_TIPO_VEHICULO_OBLIGATORIO)
    private TipoVehiculo tipoVehiculo;


    // CONSTRUCTORES
    public EntradaSalidaCreateVisitanteRequestDto() {
    }

    public EntradaSalidaCreateVisitanteRequestDto(Vehiculo vehiculo, TipoVehiculo tipoVehiculo) {
        this.vehiculo = vehiculo;
        this.tipoVehiculo = tipoVehiculo;
    }

    // GETTERS Y SETTERS
    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }
}
