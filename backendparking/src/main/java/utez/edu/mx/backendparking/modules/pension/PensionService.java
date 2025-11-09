package utez.edu.mx.backendparking.modules.pension;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;

public interface PensionService {
    PensionResponseDto create(PensionRequestDto dto);
    PensionResponseDto update(Long id, PensionRequestDto dto);
    void changeStatus(Long id);
    List<PensionResponseDto> findAll();
    Page<PensionResponseDto> findAllPensionesPaginados(Pageable pageable, String search);
}
