package utez.edu.mx.backendparking.modules.entradasalida;

import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;

import java.time.LocalTime;

public class EntradaSalidaMapper {

    // Convertir DTO de pensionado a entidad
    public static EntradaSalida toEntityFromPensionado(EntradaSalidaCreatePensionadoRequestDto dto, Usuario usuario) {
        EntradaSalida entradaSalida = new EntradaSalida();
        entradaSalida.setUsuario(usuario);
        entradaSalida.setVehiculo(dto.getVehiculo());
        entradaSalida.setHoraEntrada(LocalTime.now());
        // El tipo de vehículo se obtiene del vehículo asociado
        if (dto.getVehiculo() != null) {
            entradaSalida.setTipoVehiculo(dto.getVehiculo().getTipoVehiculo());
        }
        return entradaSalida;
    }

    // Convertir DTO de visitante a entidad
    public static EntradaSalida toEntityFromVisitante(EntradaSalidaCreateVisitanteRequestDto dto) {
        EntradaSalida entradaSalida = new EntradaSalida();
        entradaSalida.setVehiculo(dto.getVehiculo());

        // Si el vehículo está especificado, tomar su tipo de vehículo
        // Si no, usar el tipo de vehículo especificado directamente en el DTO
        if (dto.getVehiculo() != null) {
            entradaSalida.setTipoVehiculo(dto.getVehiculo().getTipoVehiculo());
        } else {
            entradaSalida.setTipoVehiculo(dto.getTipoVehiculo());
        }

        return entradaSalida;
    }

    // Convertir entidad a ResponseDto
    public static EntradaSalidaResponseDto toResponseDto(EntradaSalida entity) {
        EntradaSalidaResponseDto responseDto = new EntradaSalidaResponseDto();
        responseDto.setId(entity.getId());
        responseDto.setFolioTicket(entity.getFolioTicket());
        responseDto.setHoraEntrada(entity.getHoraEntrada());
        responseDto.setHoraSalida(entity.getHoraSalida());
        responseDto.setCantidadPago(entity.getCantidadPago());
        responseDto.setFecha(entity.getFecha());
        responseDto.setUsuario(entity.getUsuario());
        responseDto.setVehiculo(entity.getVehiculo());
        responseDto.setTipoVehiculo(entity.getTipoVehiculo());
        return responseDto;
    }

    // Actualizar datos de entrada/salida
    public static EntradaSalida toUpdateEntity(EntradaSalida entradaSalida, EntradaSalidaCreateVisitanteRequestDto dto) {
        if(dto.getVehiculo() != null) {
            entradaSalida.setVehiculo(dto.getVehiculo());
            entradaSalida.setTipoVehiculo(dto.getVehiculo().getTipoVehiculo());
        } else if(dto.getTipoVehiculo() != null) {
            entradaSalida.setTipoVehiculo(dto.getTipoVehiculo());
        }

        return entradaSalida;
    }
}
