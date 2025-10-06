package utez.edu.mx.backendparking.modules.pension.application;

import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionResponseDto;

import java.util.List;

public interface PensionService {
    PensionResponseDto create(PensionRequestDto dto);
    List<PensionResponseDto> findAll();
    void changeStatus(Long id);
}
