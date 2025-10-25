package utez.edu.mx.backendparking.modules.pension;

import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;

public class PensionMapper  {

    public static Pension toEntity(PensionRequestDto pensionRequestDto) {
        Pension pension = new Pension();
        pension.setNombre(pensionRequestDto.getNombre());
        pension.setDuracionDias(pensionRequestDto.getDuracionDias());
        pension.setCosto(pensionRequestDto.getCosto());
        return pension;
    }

    public static PensionResponseDto toResponseDto(Pension entity) {
        PensionResponseDto pensionResponseDto = new PensionResponseDto();
        pensionResponseDto.setId(entity.getId());
        pensionResponseDto.setNombre(entity.getNombre());
        pensionResponseDto.setDuracionDias(entity.getDuracionDias());
        pensionResponseDto.setCosto(entity.getCosto());
        pensionResponseDto.setStatus(entity.isStatus());
        return pensionResponseDto;
    }
}
