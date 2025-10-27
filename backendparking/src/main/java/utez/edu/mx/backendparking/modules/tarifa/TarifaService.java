package utez.edu.mx.backendparking.modules.tarifa;

import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;

import java.util.List;

public interface TarifaService {
    TarifaResponseDto create(TarifaRequestDto dto);
    List<TarifaResponseDto> findAll();
    boolean changeStatus(Long id);
}
