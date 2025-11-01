package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.domain.Page;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;

import java.util.List;

public interface EntradaSalidaService {
    EntradaSalidaResponseDto createPensionado(EntradaSalidaCreatePensionadoRequestDto dto);
    EntradaSalidaResponseDto createVisitante(EntradaSalidaCreateVisitanteRequestDto dto);
    List<EntradaSalidaResponseDto> findAll();
    EntradaSalidaResponseDto findById(Long id);
    EntradaSalidaResponseDto solicitarDatosSalidaVisitante(Integer folioTicket);
    EntradaSalidaResponseDto marcarSalidaVisitante(Integer folioTicket);
    Page<EntradaSalidaResponseDto> searchAndSortPaginated(String search, String sortBy, String sortOrder, int page, int size);
}
