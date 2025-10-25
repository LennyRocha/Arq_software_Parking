package utez.edu.mx.backendparking.modules.pension;

import java.util.List;

import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;

public interface PensionService {
    PensionResponseDto create(PensionRequestDto dto);
    List<PensionResponseDto> findAll();
    void changeStatus(Long id);
}
