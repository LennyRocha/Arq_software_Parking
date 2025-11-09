package utez.edu.mx.backendparking.modules.tarifa;

import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TarifaService {
    TarifaResponseDto findById(Long id);
    TarifaResponseDto create(TarifaRequestDto dto);
    List<TarifaResponseDto> findAll();
    List<TarifaResponseDto> findAllActiveOrderByTipoVehiculoAndTiempo();
    Page<TarifaResponseDto> searchAndSortPaginated(Double search, String sortBy, String sortOrder, int page, int size);
    boolean changeStatus(Long id);
    TarifaResponseDto update(TarifaUpdateRequestDto dto);
}
