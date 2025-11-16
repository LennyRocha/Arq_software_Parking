package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.domain.Page;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface EntradaSalidaService {
    EntradaSalidaResponseDto createPensionado(EntradaSalidaCreatePensionadoRequestDto dto);
    EntradaSalidaResponseDto createVisitante(EntradaSalidaCreateVisitanteRequestDto dto);
    List<EntradaSalidaResponseDto> findAll();
    EntradaSalidaResponseDto findById(Long id);
    EntradaSalidaResponseDto solicitarDatosSalidaVisitante(Integer folioTicket);
    EntradaSalidaResponseDto solicitarDatosSalidaPensionado(String uuidCodigoQR);
    EntradaSalidaResponseDto marcarSalidaVisitante(Integer folioTicket);
    EntradaSalidaResponseDto marcarSalidaPensionado(String uuidCodigoQR);
    Page<EntradaSalidaResponseDto> searchAndSortPaginated(String search, String sortBy, String sortOrder, int page, int size);
    Page<ReporteGananciasResponseDto> generarReporteGananciasPorHora(LocalDate fechaInicial, LocalDate fechaFinal, String sortOrder, int page, int size);

}
