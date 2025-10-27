package utez.edu.mx.backendparking.modules.tarifa;

import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;

public class TarifaMapper {

    public static Tarifa toEntity(TarifaRequestDto tarifaRequestDto) {
        Tarifa tarifa = new Tarifa();
        tarifa.setTiempo(tarifaRequestDto.getTiempo());
        tarifa.setCosto(tarifaRequestDto.getCosto());
        tarifa.setTipoVehiculo(tarifaRequestDto.getTipoVehiculo());
        tarifa.setEstatus(tarifaRequestDto.getEstatus()); // Por defecto activo
        return tarifa;
    }

    public static TarifaResponseDto toResponseDto(Tarifa entity) {
        TarifaResponseDto tarifaResponseDto = new TarifaResponseDto();
        tarifaResponseDto.setId(entity.getId());
        tarifaResponseDto.setTiempo(entity.getTiempo());
        tarifaResponseDto.setCosto(entity.getCosto());
        tarifaResponseDto.setEstatus(entity.getEstatus());
        tarifaResponseDto.setTipoVehiculo(entity.getTipoVehiculo());
        return tarifaResponseDto;
    }
}

