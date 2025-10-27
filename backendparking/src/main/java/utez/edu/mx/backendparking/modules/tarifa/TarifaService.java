package utez.edu.mx.backendparking.modules.tarifa;

import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;

import java.util.List;

public interface TarifaService {
    TarifaResponseDto findById(Long id);
    TarifaResponseDto create(TarifaRequestDto dto);
    List<TarifaResponseDto> findAll();
    List<TarifaResponseDto> findAllActiveOrderByTipoVehiculoAndTiempo();
    boolean changeStatus(Long id);
    TarifaResponseDto update(TarifaUpdateRequestDto dto);
}
