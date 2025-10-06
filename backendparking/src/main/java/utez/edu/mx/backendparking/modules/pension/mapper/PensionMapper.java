package utez.edu.mx.backendparking.modules.pension.mapper;

import utez.edu.mx.backendparking.modules.pension.domain.Pension;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionResponseDto;

public class PensionMapper  {

    public static Pension toEntity(PensionRequestDto pensionRequestDto) {
        Pension pension = new Pension();
        pension.setDuracionDias(pensionRequestDto.getDuracionDias());
        pension.setCosto(pensionRequestDto.getCosto());
        return pension;
    }

    public static PensionResponseDto toResponseDto(Pension entity) {
        PensionResponseDto pensionResponseDto = new PensionResponseDto();
        pensionResponseDto.setId(entity.getId());
        pensionResponseDto.setDuracionDias(entity.getDuracionDias());
        pensionResponseDto.setCosto(entity.getCosto());
        pensionResponseDto.setStatus(entity.isStatus());
        return pensionResponseDto;
    }
}
