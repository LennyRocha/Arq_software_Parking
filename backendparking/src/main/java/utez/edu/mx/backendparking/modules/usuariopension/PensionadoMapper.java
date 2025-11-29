package utez.edu.mx.backendparking.modules.usuariopension;

import org.springframework.stereotype.Component;
import utez.edu.mx.backendparking.modules.historialpagos.Pago;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoRegistrationDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoResponseDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.VehiculoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.usuariopension.dto.VehiculoDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PensionadoMapper {

    public static Usuario toUsuarioEntity(PensionadoRegistrationDto dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setContra(dto.getContra());
        usuario.setStatus(true);
        usuario.setEsPensionado(true);
        return usuario;
    }

    public static Vehiculo toVehiculoEntity(VehiculoDto vehiculoDto, TipoVehiculo tipoVehiculo, Usuario usuario) {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setTipoVehiculo(tipoVehiculo);
        vehiculo.setPlaca(vehiculoDto.getPlaca());
        vehiculo.setModelo(vehiculoDto.getModelo());
        vehiculo.setDescripcion(vehiculoDto.getDescripcion());
        vehiculo.setUsuario(usuario);
        vehiculo.setEstatus(true);
        return vehiculo;
    }

    public static UsuarioPension toUsuarioPensionEntity(Usuario usuario, Pension pension, String uuidCodigoQR, LocalDate fechaFinalizacion) {
        UsuarioPension usuarioPension = new UsuarioPension();
        usuarioPension.setUsuario(usuario);
        usuarioPension.setPension(pension);
        usuarioPension.setUuidCodigoQR(uuidCodigoQR);
        usuarioPension.setFechaFinalizacion(fechaFinalizacion);
        usuarioPension.setEstatus(true);
        // ultimaEntradaSalida queda como null inicialmente
        return usuarioPension;
    }

    public static Pago toPagoEntity(UsuarioPension usuarioPension, Double cantidadPago,
                                    LocalDate fechaInicio, LocalDate fechaFin, Pension pension) {
        Pago pago = new Pago();
        pago.setUsuarioPension(usuarioPension);
        pago.setCantidadPago(cantidadPago);
        pago.setFechaPago(LocalDate.now());
        pago.setFechaInicio(fechaInicio);
        pago.setFechaFin(fechaFin);
        pago.setPension(pension);
        pago.setHoraPago(LocalTime.now());

        return pago;
    }

    public static PensionadoResponseDto toResponseDto(Usuario usuario, UsuarioPension usuarioPension, Pago pago, List<Vehiculo> vehiculos) {
        PensionadoResponseDto response = new PensionadoResponseDto();
        response.setUsuarioId(usuario.getId());
        response.setNombreCompleto(usuario.getNombre() + " " + usuario.getApellidos());
        response.setCorreo(usuario.getCorreo());
        response.setTelefono(usuario.getTelefono());
        response.setUsuarioPensionId(usuarioPension.getId());
        response.setFechaFinalizacion(usuarioPension.getFechaFinalizacion());
        response.setUuidCodigoQR(usuarioPension.getUuidCodigoQR());
        response.setPagoId(pago.getId());
        response.setCantidadPago(pago.getCantidadPago());

        // Mapear vehículos
        List<VehiculoResponseDto> vehiculosResponse = vehiculos.stream()
                .map(PensionadoMapper::toVehiculoResponseDto)
                .collect(Collectors.toList());
        response.setVehiculos(vehiculosResponse);

        return response;
    }

    private static VehiculoResponseDto toVehiculoResponseDto(Vehiculo vehiculo) {
        return new VehiculoResponseDto(vehiculo.getId(), vehiculo.getTipoVehiculo().getNombre(), vehiculo.getPlaca(), vehiculo.getModelo(), vehiculo.getDescripcion());
    }
}
