package utez.edu.mx.backendparking.modules.entradasalida.dto;

import jakarta.validation.constraints.NotNull;
import utez.edu.mx.backendparking.modules.entradasalida.EntradaSalidaMessages;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.vehiculo.Vehiculo;

import java.time.LocalTime;

public class EntradaSalidaCreatePensionadoRequestDto {

    // ATRIBUTOS DE RELACION
    @NotNull(message = EntradaSalidaMessages.ERROR_USUARIO_OBLIGATORIO)
    private Usuario usuario;

    @NotNull(message = EntradaSalidaMessages.ERROR_VEHICULO_OBLIGATORIO)
    private Vehiculo vehiculo;


    // CONSTRUCTORES
    public EntradaSalidaCreatePensionadoRequestDto() {
    }

    public EntradaSalidaCreatePensionadoRequestDto(Usuario usuario, Vehiculo vehiculo) {
        this.usuario = usuario;
        this.vehiculo = vehiculo;
    }


    // GETTERS Y SETTERS
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }
}
